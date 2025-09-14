"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
class UserService {
    user = new DB_1.UserRepository();
    getProfile = async (req, res) => {
        const { id } = req.params;
        if (!id)
            throw new utils_1.BadRequestError("you should send  user id");
        const profile = await this.user.getOneById(id);
        if (!profile)
            throw new utils_1.NotFoundError("User not found");
        return res.status(200).json({ message: "success", success: true, profile });
    };
}
exports.default = new UserService();
