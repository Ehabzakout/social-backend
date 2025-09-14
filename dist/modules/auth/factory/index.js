"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const enum_1 = require("../../../utils/common/enum");
const hash_1 = require("../../../utils/hash");
const otp_1 = require("../../../utils/otp");
const entity_1 = require("../entity");
class AuthFactoryService {
    async register(registerDto) {
        const user = new entity_1.UserEntity();
        user.fullName = registerDto.fullName;
        user.email = registerDto.email;
        user.gender = registerDto.gender;
        user.password = await (0, hash_1.hashText)(registerDto.password);
        user.credentialUpdatedAt = Date.now();
        user.otp = (0, otp_1.generateOtp)();
        user.otpExpiredAt = (0, otp_1.expiryTime)();
        user.role = enum_1.SYS_ROLE.user;
        user.phone = user.phone;
        user.userAgent = enum_1.USER_AGENT.local;
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
