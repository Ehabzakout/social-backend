import { Schema } from "mongoose";
import { IComment } from "./../../../utils/common/interfaces/comment";
import { reactionSchema } from "../common";

export const commentSchema = new Schema<IComment>({
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
	parentIds: [{ type: Schema.Types.ObjectId, ref: "Comment", required: true }],
});
