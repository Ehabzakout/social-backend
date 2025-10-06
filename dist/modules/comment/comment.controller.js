"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const middleware_1 = require("../../middleware");
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/{:id}", (0, middleware_1.isValid)(comment_validation_1.commentSchema), comment_service_1.default.create);
router.get("/:id", middleware_1.isAuthenticated, comment_service_1.default.getSpecificComment);
router.delete("/:id", middleware_1.isAuthenticated, comment_service_1.default.deleteComment);
router.patch("/:id", middleware_1.isAuthenticated, comment_service_1.default.addReaction);
exports.default = router;
