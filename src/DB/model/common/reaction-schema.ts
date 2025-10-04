import { Schema } from "mongoose";
import { IReaction, REACTION } from "../../../utils";

export const reactionSchema = new Schema<IReaction>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reaction: {
			type: Number,
			enum: REACTION,
			default: REACTION.like,
			set: (value: string) => Number(value),
		},
	},
	{ timestamps: true }
);
