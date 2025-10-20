"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongoose_1 = require("mongoose");
const request_schema_1 = __importDefault(require("./request.schema"));
exports.Request = (0, mongoose_1.model)("Request", request_schema_1.default);
