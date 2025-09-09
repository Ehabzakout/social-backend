"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const abstract_repository_1 = require("../../abstract-repository");
const users_model_1 = require("./users.model");
class UserRepository extends abstract_repository_1.abstractRepository {
    constructor() {
        super(users_model_1.User);
    }
    async getAllUsers(filter, projection, options) {
        return await this.model.find(filter, projection, options);
    }
}
exports.UserRepository = UserRepository;
