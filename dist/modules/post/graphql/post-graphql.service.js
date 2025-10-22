"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.getSpecificPost = void 0;
const post_repository_1 = require("../../../DB/model/post/post-repository");
const graphql_auth_1 = require("../../../middleware/graphql-auth");
const graphql_validation_1 = require("../../../middleware/graphql.validation");
const utils_1 = require("../../../utils");
const post_validation_1 = require("./post.validation");
const getSpecificPost = async (parent, args, context) => {
    const { user } = await (0, graphql_auth_1.isAuthenticate)(context);
    (0, graphql_validation_1.isValidGraphQl)(post_validation_1.postSchema, args);
    const postRepo = new post_repository_1.PostRepository();
    const post = await postRepo.getOne({ _id: args.id }, {}, {
        populate: [
            {
                path: "userId",
                select: ["email", "_id", "firstName", "lastName"],
            },
        ],
    });
    if (!post)
        throw new utils_1.NotFoundError("Can't found post");
    return { message: "done", success: true, post };
};
exports.getSpecificPost = getSpecificPost;
const getAllPosts = async () => {
    const postRepo = new post_repository_1.PostRepository();
    const posts = await postRepo.getMany({}, {}, {
        populate: [
            {
                path: "userId",
                select: ["email", "_id", "firstName", "lastName"],
            },
        ],
    });
    return { message: "done", success: true, posts };
};
exports.getAllPosts = getAllPosts;
