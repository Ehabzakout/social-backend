import { Request, Response } from "express";
import { RequestRepository } from "../../DB/model/request/request-repository";
import { UserRepository } from "../../DB";
import {
	BadRequestError,
	ConflictError,
	ForbiddenError,
	NotFoundError,
	REQUEST_STATUS,
	REQUEST_TYPE,
} from "../../utils";
import { RequestFactory } from "./factory";
import { ObjectId, Types } from "mongoose";

class RequestService {
	requestRepo = new RequestRepository();
	userRepo = new UserRepository();

	sendFriendRequest = async (req: Request, res: Response) => {
		const userId = req.user!._id.toString();

		const { id } = req.params;
		if (!id) throw new BadRequestError("send friend id");

		if (id == userId)
			throw new ConflictError("Can't send friend request for you");

		const existedReceiver = await this.userRepo.getOne({
			_id: id,
		});
		if (!existedReceiver) throw new NotFoundError("can't found receiver");

		const blockedUsers = existedReceiver.blockedUsers.map((user) =>
			user.toString()
		);
		if (blockedUsers?.includes(userId))
			throw new ForbiddenError("can't connect with this user");

		const existedReq = await this.requestRepo.getOne({
			$and: [
				{ sender: userId },
				{ receiver: existedReceiver._id },
				{ type: REQUEST_TYPE.friend },
			],
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

	// Get user Requests
	getUserRequests = async (req: Request, res: Response) => {
		const userId = req.user!._id.toString();

		const existedUser = await this.userRepo.getOneById(
			userId,
			{ requests: 1, _id: 0 },
			{
				populate: [
					{
						path: "requests",
						populate: [
							{ path: "sender", select: ["firstName", "lastName", "email"] },
							{ path: "receiver", select: ["firstName", "lastName", "email"] },
						],
					},
				],
			}
		);
		return res
			.status(200)
			.json({ message: "Your Requests", success: true, data: existedUser });
	};

	// Response on request
	responseOnRequest = async (req: Request, res: Response) => {
		const userId = req.user!._id.toString();
		const { id } = req.params;
		const { status } = req.body;

		const existedRequest = await this.requestRepo.getOne({ _id: id });

		// Errors
		if (!existedRequest) throw new NotFoundError("Can't found request");
		if (
			![
				existedRequest.sender.toString(),
				existedRequest.receiver.toString(),
			].includes(userId)
		)
			throw new ForbiddenError("You are not authorized to access this request");
		if (
			existedRequest.receiver.toString() === userId &&
			!["accepted", "rejected"].includes(status)
		)
			throw new ForbiddenError("You should accept or reject request");
		if (existedRequest.sender.toString() === userId && status !== "canceled")
			throw new ForbiddenError("You can just cancel request");

		// If receiver accept friend request

		if (status === REQUEST_STATUS.accepted) {
			await this.userRepo.updateOne(
				{ _id: existedRequest.sender },
				{ $push: { friends: existedRequest.receiver } }
			);
			await this.userRepo.updateOne(
				{ _id: existedRequest.receiver },
				{ $push: { friends: existedRequest.sender } }
			);
		}

		// Update users requests
		await this.userRepo.updateMany(
			{
				$or: [{ _id: existedRequest.sender }, { _id: existedRequest.receiver }],
			},
			{ $pull: { requests: existedRequest._id } }
		);
		await this.requestRepo.deleteOne({ _id: existedRequest._id });

		// response
		return res.status(200).json({
			message: `your friend request has been ${status} successfully`,
			success: true,
		});
	};

	// unfriend request
	unfriendService = async (req: Request, res: Response) => {
		const userId = req.user!._id;
		const { id } = req.params;
		if (!id) throw new BadRequestError("Send id for user");
		const existedFriend = await this.userRepo.getOneById(id);

		// Errors
		if (userId.toString() === id)
			throw new BadRequestError("Can't send request to your self");
		if (!existedFriend) throw new NotFoundError("Can't found this user36");
		if (!req.user?.friends.includes(existedFriend._id))
			throw new BadRequestError("You are not a friend with this user");

		// Update users friends
		await this.userRepo.updateOne(
			{ _id: userId },
			{ $pull: { friends: existedFriend._id } }
		);
		await this.userRepo.updateOne(
			{ _id: existedFriend._id },
			{ $pull: { friends: Object(userId) } }
		);

		// Response
		return res.status(200).json({
			message: "Your unfriend request has been successful",
			success: true,
		});
	};

	// Block user service
	blockUser = async (req: Request, res: Response) => {
		const { id } = req.params;
		const userId = req.user?._id.toString();

		const existedUser = await this.userRepo.getOneById(id!);
		if (!existedUser) throw new NotFoundError("Can't found user");

		// delete request for this users
		const request = await this.requestRepo.getOneAndDelete({
			sender: userId,
			receiver: existedUser._id,
		});
		if (request) {
			await this.userRepo.updateMany(
				{ $or: [{ _id: userId }, { _id: existedUser._id }] },
				{ $pull: { requests: request._id } }
			);
		}

		// unfriend users and add blocked user
		if (req.user?.friends.includes(existedUser._id)) {
			await this.userRepo.updateOne(
				{ _id: userId },
				{
					$pull: { friends: existedUser._id },

					$push: { blockedUsers: existedUser._id },
				}
			);
			await this.userRepo.updateOne(
				{ _id: existedUser._id },
				{ $pull: { friends: userId } }
			);
		} else {
			await this.userRepo.updateOne(
				{ _id: userId },
				{ $push: { blockedUsers: existedUser._id } }
			);
		}
		return res
			.status(200)
			.json({ message: "Blocked user successfully", success: true });
	};

	// unblock user
	unblockUser = async (req: Request, res: Response) => {
		const { id } = req.params;
		const blockedUsers = req.user!.blockedUsers.map((user) => user.toString());
		if (!blockedUsers.includes(id!))
			throw new BadRequestError("user is not blocked");
		const existedUser = await this.userRepo.getOne({ _id: id });
		if (!existedUser) throw new NotFoundError("Can't found user");

		await this.userRepo.updateOne(
			{ _id: req.user!._id },
			{ $pull: { blockedUsers: existedUser._id } }
		);
		return res
			.status(200)
			.json({ message: "unblocked user successfully", success: true });
	};
}

export default new RequestService();
