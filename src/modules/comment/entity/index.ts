import { ObjectId } from "mongoose";
import { IComment, IReaction } from "./../../../utils/common";

export class CommentEntity {
	public userId!: ObjectId;
	public postId!: ObjectId;
	public content!: string;
	public reactions!: IReaction[];
	public parentId!: ObjectId | undefined;
	public mentions?: ObjectId[];
}
