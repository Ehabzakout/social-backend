"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const middleware_1 = require("../../middleware");
const auth_validation_1 = require("./auth.validation");
const auth_service_2 = __importDefault(require("./auth.service"));
const router = (0, express_1.Router)();
router.post("/register", (0, middleware_1.isValid)(auth_validation_1.registerSchema), auth_service_1.default.register);
router.post("/login", (0, middleware_1.isValid)(auth_validation_1.loginSchema), auth_service_1.default.login);
router.post("/verify-account", (0, middleware_1.isValid)(auth_validation_1.verifyOtpSchema), auth_service_2.default.verifyAccount);
router.patch("/send-otp", (0, middleware_1.isValid)(auth_validation_1.emailSchema), auth_service_2.default.sendOTP);
router.patch("/activate-2Auth", (0, middleware_1.isValid)(auth_validation_1.otpSchema), middleware_1.isAuthenticated, auth_service_2.default.activate2Auth);
router.post("/login-with-otp", (0, middleware_1.isValid)(auth_validation_1.verifyOtpSchema), auth_service_2.default.loginWithOtp);
exports.default = router;
