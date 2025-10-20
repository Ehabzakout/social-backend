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
        const { receiver } = req.body;
        const existedReceiver = await this.userRepo.getOneById(receiver);
        if (!existedReceiver)
            throw new utils_1.NotFoundError("can't found receiver");
        const request = new factory_1.RequestFactory().friendRequest(userId, receiver);
        const createdReq = await this.requestRepo.create(request);
        await this.userRepo.updateMany({ $or: [{ _id: userId }, { _id: existedReceiver._id }] }, { $push: { requests: createdReq._id } });
        return res.status(201).json({
            message: "Your friend request has been sent successfully",
            success: true,
        });
    };
}
exports.default = new RequestService();
