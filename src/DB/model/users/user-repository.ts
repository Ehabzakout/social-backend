import { ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";
import { IUser } from "../../../utils/common/interfaces/user";
import { abstractRepository } from "../../abstract-repository";
import { User } from "./users.model";

export class UserRepository extends abstractRepository<IUser> {
	constructor() {
		super(User);
	}

	async getAllUsers(
		filter: RootFilterQuery<IUser>,
		projection: ProjectionType<IUser>,
		options: QueryOptions<IUser>
	) {
		return await this.model.find(filter, projection, options);
	}
}
