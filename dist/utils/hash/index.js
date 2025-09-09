"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
exports.compareText = compareText;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hash(text) {
    return bcryptjs_1.default.hashSync(text);
}
function compareText(text, hashText) {
    return bcryptjs_1.default.compareSync(text, hashText);
}
