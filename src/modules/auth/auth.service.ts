import type { Response, Request, NextFunction } from "express";
import { RegisterDTO } from "./auth.dto";
import { UserRepository } from "./../../DB/model/users/user-repository";
import { ConflictError } from "../../utils/error";
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
		const user = this.authFactoryService.register(registerDTO);
		const newUser = await this.userRepository.create(user);
		return res
			.status(201)
			.json({ message: "user created successfully", success: true, newUser });
	};
}

export default new AuthService();
