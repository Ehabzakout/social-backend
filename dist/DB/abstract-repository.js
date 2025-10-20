"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractRepository = void 0;
class abstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    // create document
    async create(item) {
        return await this.model.create(item);
    }
    // update one method
    async updateOne(filter, update, options) {
        return await this.model.updateOne(filter, update, options);
    }
    // update one method
    async updateMany(filter, update, options) {
        return await this.model.updateMany(filter, update, options);
    }
    // get one method
    async getOne(filter, projection, options) {
        return await this.model.findOne(filter, projection, options);
    }
    // get many
    async getMany(filter, projection, options) {
        return await this.model.find(filter, projection, options);
    }
    // get one by id
    async getOneById(id, projection, options) {
        return await this.model.findById(id, projection, options);
    }
    async findOneAndUpdate(filter, update, options) {
        return await this.model.findOneAndUpdate(filter, update, options);
    }
    //   delete one method
    async deleteOne(filter, options) {
        return await this.model.deleteOne(filter, options);
    }
}
exports.abstractRepository = abstractRepository;
