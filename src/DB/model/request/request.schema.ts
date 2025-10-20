import { Schema } from "mongoose";
import { REQUEST_STATUS, REQUEST_TYPE } from "../../../utils";
import { IRequest } from "../../../utils/common/interfaces/request";

const requestSchema = new Schema<IRequest>(
	{
		type: {
			type: String,
			enum: REQUEST_TYPE,
			required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiver: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: REQUEST_STATUS,
			required: true,
			default: REQUEST_STATUS.pending,
		},
	},

	{ timestamps: true }
);

export default requestSchema;
