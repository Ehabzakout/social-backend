"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
const reactionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reaction: {
        type: Number,
        enum: utils_1.REACTION,
        default: utils_1.REACTION.like,
    },
}, { timestamps: true });
const postSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: function () {
            if (this.attachment?.length)
                return false;
            return true;
        },
        trim: true,
    },
    reactions: [reactionSchema],
    attachment: [],
}, { timestamps: true });
exports.default = postSchema;
