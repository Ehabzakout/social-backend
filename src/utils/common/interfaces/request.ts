import { Types } from "mongoose";
import { REQUEST_STATUS, REQUEST_TYPE } from "../enum";

export interface IRequest {
	sender: Types.ObjectId;
	receiver: Types.ObjectId;
	status: REQUEST_STATUS;
	type: REQUEST_TYPE;
}
