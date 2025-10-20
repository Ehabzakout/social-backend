import { ObjectId } from "mongoose";
import { REQUEST_STATUS, REQUEST_TYPE } from "../../utils";

export interface IRequestDTO {
	receiver: ObjectId;
}
