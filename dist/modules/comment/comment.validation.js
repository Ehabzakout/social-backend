"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.commentSchema = zod_1.default.object({
    content: zod_1.default.string().trim().min(3, {
        error: "Content should be at least 3 char",
    }),
});
