"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const post_service_1 = __importDefault(require("./post.service"));
const post_validation_1 = require("./post.validation");
const router = (0, express_1.Router)();
router.post("/add", middleware_1.isAuthenticated, (0, middleware_1.isValid)(post_validation_1.postSchema), post_service_1.default.create);
router.patch("/:id", middleware_1.isAuthenticated, post_service_1.default.addReact);
router.get("/:id", post_service_1.default.getSpecificPost);
exports.default = router;
