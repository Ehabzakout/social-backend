"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const request_service_1 = __importDefault(require("./request.service"));
const router = (0, express_1.Router)();
router.post("/send-friend-request/:id", middleware_1.isAuthenticated, request_service_1.default.sendFriendRequest);
router.get("/get-requests", middleware_1.isAuthenticated, request_service_1.default.getUserRequests);
router.patch("/response-on-request/:id", middleware_1.isAuthenticated, request_service_1.default.responseOnRequest);
router.patch("/unfriend/:id", middleware_1.isAuthenticated, request_service_1.default.unfriendService);
router.patch("/block/:id", middleware_1.isAuthenticated, request_service_1.default.blockUser);
router.patch("/unblock/:id", middleware_1.isAuthenticated, request_service_1.default.unblockUser);
exports.default = router;
