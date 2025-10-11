"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = exports.updatePasswordSchema = exports.emailSchema = exports.otpSchema = exports.verifyOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const utils_1 = require("../../utils");
exports.registerSchema = zod_1.default.object({
    email: zod_1.default.email().trim(),
    fullName: zod_1.default.string().min(4).trim(),
    password: zod_1.default.string().min(8).trim(),
    gender: zod_1.default.enum(utils_1.GENDER),
    phone: zod_1.default.string().length(11).optional(),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(8),
});
exports.verifyOtpSchema = zod_1.default.object({
    email: zod_1.default.email(),
    otp: zod_1.default.string().length(6),
});
exports.otpSchema = zod_1.default.object({
    otp: zod_1.default.string().length(6),
});
exports.emailSchema = zod_1.default.object({
    email: zod_1.default.email(),
});
exports.updatePasswordSchema = zod_1.default
    .object({
    password: zod_1.default.string().min(8),
    newPassword: zod_1.default.string().min(8),
    rePassword: zod_1.default.string(),
})
    .refine((values) => values.newPassword === values.rePassword, {
    path: ["rePassword"],
    error: "Your new password doesn't match",
});
exports.updateUserInfo = zod_1.default
    .object({
    firstName: zod_1.default.string().min(3).optional(),
    lastName: zod_1.default.string().min(3).optional(),
    gender: zod_1.default.enum(utils_1.GENDER).optional(),
})
    .strict()
    .refine((values) => Object.keys(values).length > 0, {
    error: "You should send at least one value",
});
