import { Router } from "express";
import usersService from "./users.service";
import { isAuthenticated } from "../../middleware";

const router = Router();

router.get("/profile/:id", isAuthenticated, usersService.getProfile);

export default router;
