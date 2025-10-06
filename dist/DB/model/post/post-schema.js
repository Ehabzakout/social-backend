"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const comment_model_1 = require("../comment/comment.model");
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
    reactions: [common_1.reactionSchema],
    attachment: [],
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });
postSchema.virtual("comments", {
    localField: "_id",
    foreignField: "postId",
    ref: "Comment",
});
postSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    // const comments = await Comment.find({ postId: filter._id, parentId: null });
    // if (comments.length) {
    // 	for (let comment of comments) {
    // 		await comment.deleteOne();
    // 	}
    // }
    // next();
    await comment_model_1.Comment.deleteMany({ postId: filter._id });
    next();
});
exports.default = postSchema;
