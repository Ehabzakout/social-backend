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
exports.default = router;
