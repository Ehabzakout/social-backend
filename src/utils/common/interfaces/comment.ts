import { ObjectId } from "mongoose";
import { IReaction } from "./post";

export interface IComment {
	userId: ObjectId;
	postId: ObjectId;
	parentIds: ObjectId[];
	content: string;
	reactions: IReaction[];
	mention?: ObjectId[];
}
