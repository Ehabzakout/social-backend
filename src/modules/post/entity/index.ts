import { ObjectId } from "mongoose";
import { IReaction } from "../../../utils";

export class PostEntity {
	public userId!: ObjectId;
	public content!: string;
	public attachment?: any[];
	public reactions!: IReaction[];
}
