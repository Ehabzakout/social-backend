import type { Response, Request, NextFunction } from "express";
import {
	LoginDTO,
	RegisterDTO,
	UpdatePasswordDTO,
	UpdateUserInfo,
	VerifyOtpDTO,
} from "./auth.dto";
import { UserRepository } from "./../../DB";
import {
	BadRequestError,
	compareText,
	ConflictError,
	expiryTime,
	ForbiddenError,
	generateOtp,
	generateToken,
	hashText,
	NotAuthorizedError,
	NotFoundError,
} from "../../utils";
import { AuthFactoryService } from "./factory";
import { authProvider } from "./providers/auth.provider";
import { sendEmail } from "../../utils/email";
import { User } from "../../DB/model/users/users.model";

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

		if (existedUser.loginWith2factor) {
			const otp = generateOtp();
			const otpExpiredAt = expiryTime();
			existedUser.otp = otp;
			existedUser.otpExpiredAt = otpExpiredAt;
			await existedUser.save();
			sendEmail({
				subject: "Social App OTP",
				to: email,
				html: `<h3>Your Otp is : ${otp}</h3>`,
			});
			return res
				.status(200)
				.json({ message: "OTP has been sent successfully", success: true });
		}
		const accessToken = generateToken({
			data: {
				id: existedUser.id as string,
				name: existedUser.firstName,
				role: String(existedUser.role),
			},
			options: { expiresIn: "1d" },
		});
		return res
			.status(200)
			.json({ message: "logged in successfully", success: true, accessToken });
	};

	// Verify Account
	verifyAccount = async (req: Request, res: Response) => {
		const verifyAccountDTO: VerifyOtpDTO = req.body;
		await authProvider.checkOTP(verifyAccountDTO);
		this.userRepository.updateOne(
			{ email: verifyAccountDTO.email },
			{ isVerified: true, $unset: { otp: "", otpExpiredAt: "" } }
		);
		return res.sendStatus(204);
	};

	// Send OTP
	sendOTP = async (req: Request, res: Response) => {
		const { email } = req.body;
		const otp = generateOtp();
		const otpExpiredAt = expiryTime();

		const existedUser = await this.userRepository.getOne({ email });
		if (!existedUser) throw new NotFoundError("Can't found user");

		if (
			existedUser.otpExpiredAt &&
			new Date(existedUser.otpExpiredAt) > new Date()
		)
			throw new BadRequestError("Your OTP is not expired");

		existedUser.otp = otp;
		existedUser.otpExpiredAt = otpExpiredAt;
		await existedUser.save();
		sendEmail({
			subject: "Social App OTP",
			to: email,
			html: `<h3>Your Otp is : ${otp}</h3>`,
		});

		return res.sendStatus(204);
	};

	// Activate 2-step verification
	activate2Auth = async (req: Request, res: Response) => {
		const user = req.user;
		const { otp } = req.body;

		if (!user?.otp)
			throw new BadRequestError("You should send OTP to your Email first");
		if (user?.otp && user?.otp !== otp)
			throw new BadRequestError("invalid OTP");
		if (user.otpExpiredAt && new Date() > new Date(user.otpExpiredAt))
			throw new BadRequestError("OTP Expired");

		if (!user.loginWith2factor) {
			await User.updateOne(
				{ _id: user._id },
				{
					loginWith2factor: true,
					credentialUpdatedAt: Date.now(),
					$unset: { otp: "", otpExpiredAt: "" },
				}
			);
		} else {
			await User.updateOne(
				{ _id: user._id },
				{
					loginWith2factor: false,
					credentialUpdatedAt: Date.now(),
					$unset: { otp: "", otpExpiredAt: "" },
				}
			);
		}
		return res
			.status(200)
			.json({ message: "You 2 factor auth login updated", success: true });
	};

	// login with otp
	loginWithOtp = async (req: Request, res: Response) => {
		const { email, otp } = req.body;

		const existedUser = await this.userRepository.getOne({ email });
		if (!existedUser?.loginWith2factor)
			throw new ForbiddenError("Login with 2 factor is not activated");
		if (!existedUser) throw new NotFoundError("Can't found user");
		if (!existedUser.otp)
			throw new NotAuthorizedError("You should send otp to your email first");
		if (existedUser.otp != otp) throw new NotAuthorizedError("Invalid otp");
		if (existedUser.otpExpiredAt && existedUser?.otpExpiredAt < new Date())
			throw new ForbiddenError("expired otp");

		delete existedUser.otp;
		delete existedUser.otpExpiredAt;
		await existedUser.save();
		const accessToken = generateToken({
			data: {
				id: existedUser.id as string,
				name: existedUser.firstName,
				role: String(existedUser.role),
			},
			options: { expiresIn: "1d" },
		});
		return res
			.status(200)
			.json({ message: "logged in successfully", success: true, accessToken });
	};

	// update password
	updatePassword = async (req: Request, res: Response) => {
		const { password, newPassword, rePassword }: UpdatePasswordDTO = req.body;
		if (newPassword !== rePassword)
			throw new BadRequestError("Your new password doesn't match");
		const match = await compareText(password, req.user!.password);
		if (!match) throw new NotAuthorizedError("Old password isn't correct");
		const hashPassword = await hashText(newPassword);
		await this.userRepository.updateOne(
			{ _id: req.user?._id },
			{ password: hashPassword, credentialUpdatedAt: Date.now() }
		);
		return res
			.status(200)
			.json({ message: "Your password updated successfully", success: true });
	};

	// update email
	updateEmail = async (req: Request, res: Response) => {
		const { email } = req.body;
		const existedEmail = await this.userRepository.getOne({ email });
		if (existedEmail) throw new ConflictError("Email is already exist");
		await this.userRepository.findOneAndUpdate(
			{ _id: req.user?._id },
			{ email }
		);
		return res
			.status(201)
			.json({ message: "Your email updated successfully", success: true });
	};

	// update user info
	updateUserInfo = async (req: Request, res: Response) => {
		const userData: UpdateUserInfo = req.body;

		await this.userRepository.findOneAndUpdate(
			{ _id: req.user?._id },
			userData
		);
		return res
			.status(200)
			.json({ message: "Your data updated successfully", success: true });
	};
}

export default new AuthService();
