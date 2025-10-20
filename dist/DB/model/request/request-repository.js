"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRepository = void 0;
const abstract_repository_1 = require("../../abstract-repository");
const request_model_1 = require("./request.model");
class RequestRepository extends abstract_repository_1.abstractRepository {
    constructor() {
        super(request_model_1.Request);
    }
}
exports.RequestRepository = RequestRepository;
