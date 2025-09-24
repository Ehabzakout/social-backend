import { ObjectId } from "mongoose";
import { REACTION } from "../enum";
export interface IReaction {
	reaction: REACTION;
	userId: ObjectId;
}
export interface IPost {
	userId: ObjectId;
	content: string;
	attachment?: any[];

	reactions: IReaction[];
}
