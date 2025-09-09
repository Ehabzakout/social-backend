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
    // get one method
    async getOne(filter, projection, options) {
        return this.model.findOne(filter, projection, options);
    }
    //   delete one method
    async deleteOne(filter, options) {
        return this.model.deleteOne(filter, options);
    }
}
exports.abstractRepository = abstractRepository;
