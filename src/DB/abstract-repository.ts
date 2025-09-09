import {
	Model,
	MongooseBaseQueryOptions,
	MongooseUpdateQueryOptions,
	ProjectionType,
	QueryOptions,
	RootFilterQuery,
} from "mongoose";

export abstract class abstractRepository<T> {
	constructor(protected model: Model<T>) {}

	// create document
	async create(item: Partial<T>) {
		return await this.model.create(item);
	}

	// update one method
	async updateOne(
		filter: RootFilterQuery<T>,
		update: Partial<T>,
		options?: MongooseUpdateQueryOptions<T>
	) {
		return await this.model.updateOne(filter, update, options);
	}

	// get one method
	async getOne(
		filter: RootFilterQuery<T>,
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	) {
		return this.model.findOne(filter, projection, options);
	}

	//   delete one method
	async deleteOne(
		filter: RootFilterQuery<T>,
		options?: MongooseBaseQueryOptions<T>
	) {
		return this.model.deleteOne(filter, options);
	}
}
