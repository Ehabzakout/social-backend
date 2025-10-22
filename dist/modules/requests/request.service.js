"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_repository_1 = require("../../DB/model/request/request-repository");
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
class RequestService {
    requestRepo = new request_repository_1.RequestRepository();
    userRepo = new DB_1.UserRepository();
    sendFriendRequest = async (req, res) => {
        const userId = req.user._id.toString();
        const { id } = req.params;
        if (!id)
            throw new utils_1.BadRequestError("send friend id");
        if (id == userId)
            throw new utils_1.ConflictError("Can't send friend request for you");
        const existedReceiver = await this.userRepo.getOne({
            _id: id,
        });
        if (!existedReceiver)
            throw new utils_1.NotFoundError("can't found receiver");
        const blockedUsers = existedReceiver.blockedUsers.map((user) => user.toString());
        if (blockedUsers?.includes(userId))
            throw new utils_1.ForbiddenError("can't connect with this user");
        const existedReq = await this.requestRepo.getOne({
            $and: [
                { sender: userId },
                { receiver: existedReceiver._id },
                { type: utils_1.REQUEST_TYPE.friend },
            ],
        });
        if (existedReq)
            throw new utils_1.ConflictError("You have sent this request before");
        const request = new factory_1.RequestFactory().friendRequest(userId, id);
        const createdReq = await this.requestRepo.create(request);
        await this.userRepo.updateMany({ $or: [{ _id: userId }, { _id: existedReceiver._id }] }, { $push: { requests: createdReq._id } });
        return res.status(201).json({
            message: "Your friend request has been sent successfully",
            success: true,
        });
    };
    // Get user Requests
    getUserRequests = async (req, res) => {
        const userId = req.user._id.toString();
        const existedUser = await this.userRepo.getOneById(userId, { requests: 1, _id: 0 }, {
            populate: [
                {
                    path: "requests",
                    populate: [
                        { path: "sender", select: ["firstName", "lastName", "email"] },
                        { path: "receiver", select: ["firstName", "lastName", "email"] },
                    ],
                },
            ],
        });
        return res
            .status(200)
            .json({ message: "Your Requests", success: true, data: existedUser });
    };
    // Response on request
    responseOnRequest = async (req, res) => {
        const userId = req.user._id.toString();
        const { id } = req.params;
        const { status } = req.body;
        const existedRequest = await this.requestRepo.getOne({ _id: id });
        // Errors
        if (!existedRequest)
            throw new utils_1.NotFoundError("Can't found request");
        if (![
            existedRequest.sender.toString(),
            existedRequest.receiver.toString(),
        ].includes(userId))
            throw new utils_1.ForbiddenError("You are not authorized to access this request");
        if (existedRequest.receiver.toString() === userId &&
            !["accepted", "rejected"].includes(status))
            throw new utils_1.ForbiddenError("You should accept or reject request");
        if (existedRequest.sender.toString() === userId && status !== "canceled")
            throw new utils_1.ForbiddenError("You can just cancel request");
        // If receiver accept friend request
        if (status === utils_1.REQUEST_STATUS.accepted) {
            await this.userRepo.updateOne({ _id: existedRequest.sender }, { $push: { friends: existedRequest.receiver } });
            await this.userRepo.updateOne({ _id: existedRequest.receiver }, { $push: { friends: existedRequest.sender } });
        }
        // Update users requests
        await this.userRepo.updateMany({
            $or: [{ _id: existedRequest.sender }, { _id: existedRequest.receiver }],
        }, { $pull: { requests: existedRequest._id } });
        await this.requestRepo.deleteOne({ _id: existedRequest._id });
        // response
        return res.status(200).json({
            message: `your friend request has been ${status} successfully`,
            success: true,
        });
    };
    // unfriend request
    unfriendService = async (req, res) => {
        const userId = req.user._id;
        const { id } = req.params;
        if (!id)
            throw new utils_1.BadRequestError("Send id for user");
        const existedFriend = await this.userRepo.getOneById(id);
        // Errors
        if (userId.toString() === id)
            throw new utils_1.BadRequestError("Can't send request to your self");
        if (!existedFriend)
            throw new utils_1.NotFoundError("Can't found this user36");
        if (!req.user?.friends.includes(existedFriend._id))
            throw new utils_1.BadRequestError("You are not a friend with this user");
        // Update users friends
        await this.userRepo.updateOne({ _id: userId }, { $pull: { friends: existedFriend._id } });
        await this.userRepo.updateOne({ _id: existedFriend._id }, { $pull: { friends: Object(userId) } });
        // Response
        return res.status(200).json({
            message: "Your unfriend request has been successful",
            success: true,
        });
    };
    // Block user service
    blockUser = async (req, res) => {
        const { id } = req.params;
        const userId = req.user?._id.toString();
        const existedUser = await this.userRepo.getOneById(id);
        if (!existedUser)
            throw new utils_1.NotFoundError("Can't found user");
        // delete request for this users
        const request = await this.requestRepo.getOneAndDelete({
            sender: userId,
            receiver: existedUser._id,
        });
        if (request) {
            await this.userRepo.updateMany({ $or: [{ _id: userId }, { _id: existedUser._id }] }, { $pull: { requests: request._id } });
        }
        // unfriend users and add blocked user
        if (req.user?.friends.includes(existedUser._id)) {
            await this.userRepo.updateOne({ _id: userId }, {
                $pull: { friends: existedUser._id },
                $push: { blockedUsers: existedUser._id },
            });
            await this.userRepo.updateOne({ _id: existedUser._id }, { $pull: { friends: userId } });
        }
        else {
            await this.userRepo.updateOne({ _id: userId }, { $push: { blockedUsers: existedUser._id } });
        }
        return res
            .status(200)
            .json({ message: "Blocked user successfully", success: true });
    };
    // unblock user
    unblockUser = async (req, res) => {
        const { id } = req.params;
        const blockedUsers = req.user.blockedUsers.map((user) => user.toString());
        if (!blockedUsers.includes(id))
            throw new utils_1.BadRequestError("user is not blocked");
        const existedUser = await this.userRepo.getOne({ _id: id });
        if (!existedUser)
            throw new utils_1.NotFoundError("Can't found user");
        await this.userRepo.updateOne({ _id: req.user._id }, { $pull: { blockedUsers: existedUser._id } });
        return res
            .status(200)
            .json({ message: "unblocked user successfully", success: true });
    };
}
exports.default = new RequestService();
