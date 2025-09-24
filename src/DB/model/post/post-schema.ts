import { Schema, ObjectId } from "mongoose";
import { IPost, IReaction } from "../../../utils/common/interfaces/post";

import { REACTION } from "../../../utils";

const reactionSchema = new Schema<IReaction>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reaction: {
			type: Number,
			enum: REACTION,
			default: REACTION.like,
		},
	},
	{ timestamps: true }
);

const postSchema = new Schema<IPost>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: function () {
				if (this.attachment?.length) return false;
				return true;
			},
			trim: true,
		},

		reactions: [reactionSchema],
		attachment: [],
	},
	{ timestamps: true }
);

export default postSchema;
