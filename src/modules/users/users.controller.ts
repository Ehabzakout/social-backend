import { Router } from "express";
import usersService from "./users.service";

const router = Router();

router.get("/profile/:id", usersService.getProfile);

export default router;
