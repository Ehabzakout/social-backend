import { Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";

import RequestService from "./request.service";
const router = Router();

router.post(
	"/send-friend-request/:id",
	isAuthenticated,

	RequestService.sendFriendRequest
);
router.get("/get-requests", isAuthenticated, RequestService.getUserRequests);

router.patch(
	"/response-on-request/:id",
	isAuthenticated,
	RequestService.responseOnRequest
);

router.patch("/unfriend/:id", isAuthenticated, RequestService.unfriendService);
router.patch("/block/:id", isAuthenticated, RequestService.blockUser);
router.patch("/unblock/:id", isAuthenticated, RequestService.unblockUser);

export default router;
