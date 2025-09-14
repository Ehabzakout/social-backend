"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashText = hashText;
exports.compareText = compareText;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function hashText(text) {
    return await bcryptjs_1.default.hash(text, 10);
}
async function compareText(text, hashText) {
    return await bcryptjs_1.default.compare(text, hashText);
}
