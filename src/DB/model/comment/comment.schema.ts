import { Schema } from "mongoose";
import { IComment } from "./../../../utils/common/interfaces/comment";
import { reactionSchema } from "../common";
import id from "zod/v4/locales/id.js";

export const commentSchema = new Schema<IComment>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		postId: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		content: {
			type: String,
			minlength: 5,
			required: true,
			trim: true,
		},
		reactions: [reactionSchema],
		parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
		mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
		isDeleted: { type: Boolean, default: false, required: true },
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.virtual("replies", {
	ref: "Comment",
	localField: "_id",
	foreignField: "parentId",
});

commentSchema.pre("deleteOne", async function (next) {
	const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
	const replies = await this?.model.find({ parentId: filter._id });
	if (replies.length) {
		for (let reply of replies) {
			await this.model.deleteOne({ _id: reply._id });
		}
	}
	next();
});

commentSchema.pre("findOne", function (next) {
	this.where({ isDeleted: false });
	next();
});

commentSchema.pre("updateOne", async function (next) {
	const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
	const update = typeof this.getUpdate == "function" ? this.getUpdate() : {};

	//@ts-expect-error
	if ([true, false].includes(update.$set.isDeleted)) {
		const replies = await this?.model.find({ parentId: filter._id });

		if (replies.length) {
			for (let reply of replies) {
				await this.model.updateOne(
					{ _id: reply._id },

					//@ts-expect-error
					{ $set: { isDeleted: update.$set.isDeleted } }
				);
			}
		}
	}
	next();
});
