import type { Response, Request, NextFunction } from "express";
import { LoginDTO, RegisterDTO, VerifyAccountDTO } from "./auth.dto";
import { UserRepository } from "./../../DB";
import {
	compareText,
	ConflictError,
	NotAuthorizedError,
	NotFoundError,
} from "../../utils";
import { AuthFactoryService } from "./factory";
import { authProvider } from "./providers/auth.provider";

class AuthService {
	private userRepository = new UserRepository();
	private authFactoryService = new AuthFactoryService();
	constructor() {}
	register = async (req: Request, res: Response, next: NextFunction) => {
		const registerDTO: RegisterDTO = req.body;
		const existedUser = await this.userRepository.getOne({
			email: registerDTO.email,
		});

		if (existedUser) throw new ConflictError("User already exist");
		const user = await this.authFactoryService.register(registerDTO);
		const newUser = await this.userRepository.create(user);
		return res.status(201).json({
			message: "user created successfully",
			success: true,
			id: newUser._id,
		});
	};

	// login

	login = async (req: Request, res: Response) => {
		const { email, password }: LoginDTO = req.body;

		const existedUser = await this.userRepository.getOne({ email });
		if (!existedUser) throw new NotFoundError("user not found");
		const match = await compareText(password, existedUser.password);
		if (!match) throw new NotAuthorizedError("Invalid credentials");
		if (!existedUser.isVerified)
			throw new NotAuthorizedError("Verify your account");
		return res
			.status(200)
			.json({ message: "logged in successfully", success: true });
	};

	// Verify Account
	verifyAccount = async (req: Request, res: Response) => {
		const verifyAccountDTO: VerifyAccountDTO = req.body;
		await authProvider.checkOTP(verifyAccountDTO);
		this.userRepository.updateOne(
			{ email: verifyAccountDTO.email },
			{ isVerified: true, $unset: { otp: "", otpExpiredAt: "" } }
		);
		return res.sendStatus(204);
	};
}

export default new AuthService();
