import { Request, Response } from "express";
import { RequestRepository } from "../../DB/model/request/request-repository";
import { UserRepository } from "../../DB";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils";
import { RequestFactory } from "./factory";
import { ObjectId } from "mongoose";

class RequestService {
	requestRepo = new RequestRepository();
	userRepo = new UserRepository();

	sendFriendRequest = async (req: Request, res: Response) => {
		const userId = req.user!._id.toString();

		const { id } = req.params;
		if (!id) throw new BadRequestError("send friend id");

		if (id == userId)
			throw new ConflictError("Can't send friend request for you");

		const existedReceiver = await this.userRepo.getOneById(id);
		if (!existedReceiver) throw new NotFoundError("can't found receiver");
		if (existedReceiver.friends.includes(id as unknown as ObjectId))
			throw new ConflictError("You are already friend with user");

		const existedReq = await this.requestRepo.getOne({
			$and: [{ sender: userId }, { receiver: existedReceiver._id }],
		});
		if (existedReq)
			throw new ConflictError("You have sent this request before");
		const request = new RequestFactory().friendRequest(userId, id);
		const createdReq = await this.requestRepo.create(request);
		await this.userRepo.updateMany(
			{ $or: [{ _id: userId }, { _id: existedReceiver._id }] },
			{ $push: { requests: createdReq._id } }
		);
		return res.status(201).json({
			message: "Your friend request has been sent successfully",
			success: true,
		});
	};
}

export default new RequestService();
