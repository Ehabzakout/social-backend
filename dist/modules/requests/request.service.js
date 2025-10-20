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
        const existedReceiver = await this.userRepo.getOneById(id);
        if (!existedReceiver)
            throw new utils_1.NotFoundError("can't found receiver");
        if (existedReceiver.friends.includes(id))
            throw new utils_1.ConflictError("You are already friend with user");
        const existedReq = await this.requestRepo.getOne({
            $and: [{ sender: userId }, { receiver: existedReceiver._id }],
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
}
exports.default = new RequestService();
