import type { Response, Request, NextFunction } from "express";
import { LoginDTO, RegisterDTO } from "./auth.dto";
import { UserRepository } from "./../../DB";
import {
	compareText,
	ConflictError,
	NotAuthorizedError,
	NotFoundError,
} from "../../utils";
import { AuthFactoryService } from "./factory";

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
		return res
			.status(201)
			.json({ message: "user created successfully", success: true, newUser });
	};

	// login

	login = async (req: Request, res: Response) => {
		const { email, password }: LoginDTO = req.body;

		const existedUser = await this.userRepository.getOne({ email });
		if (!existedUser) throw new NotFoundError("user not found");
		const match = await compareText(password, existedUser.password);
		if (!match) throw new NotAuthorizedError("Invalid credentials");

		return res
			.status(200)
			.json({ message: "logged in successfully", success: true });
	};
}

export default new AuthService();
