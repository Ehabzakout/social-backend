"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const error_1 = require("../utils/error");
const token_1 = require("../utils/token");
const user_repository_1 = require("../DB/model/users/user-repository");
async function isAuthenticated(req, res, next) {
    const { accesstoken } = req.headers;
    if (!accesstoken)
        throw new error_1.NotAuthorizedError("You are not logged in");
    const payload = (0, token_1.verifyToken)(accesstoken);
    const User = new user_repository_1.UserRepository();
    const existedUser = await User.getOneById(payload.id);
    if (!existedUser)
        throw new error_1.NotFoundError("user not found");
    if (existedUser.credentialUpdatedAt > new Date(payload.iat))
        throw new error_1.NotAuthorizedError("Expired logged in");
    req.user = existedUser;
    next();
}
