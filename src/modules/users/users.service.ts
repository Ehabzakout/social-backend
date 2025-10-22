import { Request, Response } from "express";
import { UserRepository } from "../../DB";
import { BadRequestError, NotFoundError } from "../../utils";

class UserService {
	public userRepo = new UserRepository();
	getProfile = async (req: Request, res: Response) => {
		const id = req.user?._id.toString();
		if (!id) throw new BadRequestError("you should send  user id");
		const profile = await this.userRepo.getOneById(id);
		if (!profile) throw new NotFoundError("User not found");
		return res.status(200).json({ message: "success", success: true, profile });
	};
}

export default new UserService();
