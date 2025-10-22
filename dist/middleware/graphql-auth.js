"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticate = void 0;
const DB_1 = require("../DB");
const utils_1 = require("../utils");
const isAuthenticate = async (context) => {
    const { token } = context;
    if (!token)
        throw new utils_1.NotAuthorizedError("You are not logged in");
    const payload = (0, utils_1.verifyToken)(token);
    const User = new DB_1.UserRepository();
    const existedUser = await User.getOneById(payload.id);
    if (!existedUser)
        throw new utils_1.NotFoundError("user not found");
    if (existedUser.credentialUpdatedAt > new Date(payload.iat * 1000))
        throw new utils_1.NotAuthorizedError("Expired logged in");
    context.user = existedUser;
    return context;
};
exports.isAuthenticate = isAuthenticate;
