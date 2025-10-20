import { ObjectId } from "mongoose";
import { IReaction } from "./post";

export interface IComment {
	_id: ObjectId;
	userId: ObjectId;
	postId: ObjectId;
	parentId: ObjectId | undefined;
	content: string;
	reactions: IReaction[];
	mentions?: ObjectId[];
	isDeleted: boolean;
}
