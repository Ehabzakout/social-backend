import { ObjectId } from "mongoose";
import { REACTION } from "../enum";
export interface IReaction {
	reaction: REACTION;
	userId: ObjectId;
}
export interface IPost {
	_id: ObjectId;
	userId: ObjectId;
	content: string;
	attachment?: any[];

	reactions: IReaction[];
}
