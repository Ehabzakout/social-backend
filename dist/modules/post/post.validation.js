"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReactSchema = exports.postSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const utils_1 = require("../../utils");
exports.postSchema = zod_1.default
    .object({
    content: zod_1.default
        .string()
        .min(20, { error: "Your content should be larger than 20 char" })
        .optional(),
    attachments: zod_1.default
        .array(zod_1.default
        .instanceof(File)
        .refine((file) => file.size <= 4 * 1024 * 1024, {
        message: "Max file size is 4MB",
    }))
        .min(1)
        .max(4)
        .optional(),
})
    .refine((values) => values.content || (values.attachments && values.attachments.length > 0), { path: ["content"], message: "you should add content or attachments" });
exports.addReactSchema = zod_1.default.object({
    reaction: zod_1.default.enum(utils_1.REACTION),
});
