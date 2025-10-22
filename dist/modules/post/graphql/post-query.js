"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQuery = void 0;
const graphql_1 = require("graphql");
const post_type_1 = require("./post-type");
const post_graphql_service_1 = require("./post-graphql.service");
exports.postQuery = {
    getPost: {
        type: post_type_1.postResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
        },
        resolve: post_graphql_service_1.getSpecificPost,
    },
    getPosts: {
        type: post_type_1.postsResponse,
        resolve: post_graphql_service_1.getAllPosts,
    },
};
