"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const abstract_repository_1 = require("../../abstract-repository");
const post_model_1 = __importDefault(require("./post.model"));
class PostRepository extends abstract_repository_1.abstractRepository {
    constructor() {
        super(post_model_1.default);
    }
}
exports.PostRepository = PostRepository;
