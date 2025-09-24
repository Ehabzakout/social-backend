"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../../config/env/env-config"));
const secretKey = env_config_1.default.JWT_SECRET;
function generateToken({ data, secret = secretKey, options, }) {
    return jsonwebtoken_1.default.sign(data, secret, options);
}
function verifyToken(token, secret = secretKey) {
    const payload = jsonwebtoken_1.default.verify(token, secret);
    return payload;
}
