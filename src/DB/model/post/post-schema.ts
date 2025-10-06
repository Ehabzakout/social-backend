import { Schema } from "mongoose";
import { IPost } from "../../../utils/common/interfaces/post";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";

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
	{ timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
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
	await Comment.deleteMany({ postId: filter._id });
	next();
});

export default postSchema;
