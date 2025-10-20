import { Types } from "mongoose";
import { RequestEntity } from "../entity";
import { REQUEST_STATUS, REQUEST_TYPE } from "../../../utils";

export class RequestFactory {
	friendRequest = (id: string, receiverId: string) => {
		const request = new RequestEntity();
		request.sender = id as unknown as Types.ObjectId;
		request.receiver = receiverId as unknown as Types.ObjectId;
		request.status = REQUEST_STATUS.pending;
		request.type = REQUEST_TYPE.friend;
		return request;
	};
}
