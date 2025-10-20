import { IRequest } from "../../../utils/common/interfaces/request";
import { abstractRepository } from "../../abstract-repository";
import { Request } from "./request.model";

export class RequestRepository extends abstractRepository<IRequest> {
	constructor() {
		super(Request);
	}
}
