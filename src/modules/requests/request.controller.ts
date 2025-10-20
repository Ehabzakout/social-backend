import { Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";

import RequestService from "./request.service";
const router = Router();

router.post(
	"/send-friend-request/:id",
	isAuthenticated,

	RequestService.sendFriendRequest
);

export default router;
