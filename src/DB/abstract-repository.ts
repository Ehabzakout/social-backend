import {
	Model,
	MongooseBaseQueryOptions,
	MongooseUpdateQueryOptions,
	ProjectionType,
	QueryOptions,
	RootFilterQuery,
	UpdateQuery,
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
		update: UpdateQuery<T>,
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
		return await this.model.findOne(filter, projection, options);
	}

	// get one by id
	async getOneById(
		id: string,
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	) {
		return await this.model.findById(id, projection, options);
	}

	//   delete one method
	async deleteOne(
		filter: RootFilterQuery<T>,
		options?: MongooseBaseQueryOptions<T>
	) {
		return await this.model.deleteOne(filter, options);
	}
}
