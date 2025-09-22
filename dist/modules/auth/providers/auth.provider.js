"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProvider = void 0;
const DB_1 = require("../../../DB");
const utils_1 = require("../../../utils");
exports.authProvider = {
    async checkOTP({ email, otp }) {
        const userRepository = new DB_1.UserRepository();
        const existedUser = await userRepository.getOne({ email });
        if (!existedUser)
            throw new utils_1.NotFoundError("User not exist");
        if (existedUser.otp !== otp)
            throw new utils_1.BadRequestError("Invalid otp");
        if (existedUser.otpExpiredAt < new Date())
            throw new utils_1.BadRequestError("Expired OTP");
    },
};
