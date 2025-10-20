"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
const requestSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: utils_1.REQUEST_TYPE,
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: utils_1.REQUEST_STATUS,
        required: true,
        default: utils_1.REQUEST_STATUS.pending,
    },
}, { timestamps: true });
exports.default = requestSchema;
