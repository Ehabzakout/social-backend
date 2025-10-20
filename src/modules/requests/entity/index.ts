import { Types } from "mongoose";
import { REQUEST_STATUS, REQUEST_TYPE } from "../../../utils";

export class RequestEntity {
	public sender!: Types.ObjectId;
	public receiver!: Types.ObjectId;
	public status!: REQUEST_STATUS;
	public type!: REQUEST_TYPE;
}
