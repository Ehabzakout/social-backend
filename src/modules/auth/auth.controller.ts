import { Router } from "express";
import AuthService from "./auth.service";
import { isAuthenticated, isValid } from "../../middleware";
import {
	emailSchema,
	loginSchema,
	otpSchema,
	registerSchema,
	updatePasswordSchema,
	updateUserInfo,
	verifyOtpSchema,
} from "./auth.validation";
import authService from "./auth.service";

const router = Router();

router.post("/register", isValid(registerSchema), AuthService.register);
router.post("/login", isValid(loginSchema), AuthService.login);
router.post(
	"/verify-account",
	isValid(verifyOtpSchema),
	authService.verifyAccount
);
router.patch("/send-otp", isValid(emailSchema), authService.sendOTP);
router.patch(
	"/activate-2Auth",
	isValid(otpSchema),
	isAuthenticated,
	authService.activate2Auth
);
router.post(
	"/login-with-otp",
	isValid(verifyOtpSchema),
	authService.loginWithOtp
);

router.patch(
	"/update-password",
	isAuthenticated,
	isValid(updatePasswordSchema),
	authService.updatePassword
);

router.patch(
	"/update-email",
	isAuthenticated,
	isValid(emailSchema),
	authService.updateEmail
);
router.put(
	"/update-user-info",
	isAuthenticated,
	isValid(updateUserInfo),
	authService.updateUserInfo
);
export default router;
