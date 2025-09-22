import { Router } from "express";
import AuthService from "./auth.service";
import { isValid } from "../../middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import authService from "./auth.service";

const router = Router();

router.post("/register", isValid(registerSchema), AuthService.register);
router.post("/login", isValid(loginSchema), AuthService.login);
router.post("/verify-account", authService.verifyAccount);
export default router;
