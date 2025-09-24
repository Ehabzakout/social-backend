"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const post_schema_1 = __importDefault(require("./post-schema"));
const Post = (0, mongoose_1.model)("Post", post_schema_1.default);
exports.default = Post;
