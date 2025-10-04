import { Schema } from "mongoose";
import { IPost } from "../../../utils/common/interfaces/post";
import { reactionSchema } from "../common";

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
