"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_service_1 = __importDefault(require("./users.service"));
const middleware_1 = require("../../middleware");
const router = (0, express_1.Router)();
router.get("/profile", middleware_1.isAuthenticated, users_service_1.default.getProfile);
exports.default = router;
