import { ObjectId } from "mongoose";

export type commentDTO = {
	content: string;
	mentions?: string[];
};
