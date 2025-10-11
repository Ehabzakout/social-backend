import { ObjectId } from "mongoose";
import { CommentEntity } from "../entity";
import { commentDTO } from "../comment.dto";
import { IComment } from "../../../utils";

export class CommentFactory {
	createComment = async ({
		commentDTO,
		userId,
		postId,
		existedComment,
	}: {
		commentDTO: commentDTO;
		userId: ObjectId;
		postId: ObjectId;
		existedComment?: IComment;
	}) => {
		const comment = new CommentEntity();
		comment.content = commentDTO.content;
		comment.postId = postId || existedComment?.postId;
		comment.userId = userId;
		comment.reactions = [];
		comment.parentId = existedComment?._id;

		return comment;
	};
}
