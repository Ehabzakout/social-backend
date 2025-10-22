"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsResponse = exports.postResponse = exports.postType = void 0;
const graphql_1 = require("graphql");
const user_type_1 = require("../../users/graphql/user-type");
exports.postType = new graphql_1.GraphQLObjectType({
    name: "Post",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        userId: { type: user_type_1.userType },
        reactions: {
            type: new graphql_1.GraphQLList(new graphql_1.GraphQLObjectType({
                name: "reactions",
                fields: {
                    userId: { type: graphql_1.GraphQLID },
                    reaction: { type: graphql_1.GraphQLInt },
                },
            })),
        },
        createdAt: {
            type: graphql_1.GraphQLString,
            resolve: (parent) => {
                return new Date(parent.createdAt).toISOString();
            },
        },
        updatedAt: {
            type: graphql_1.GraphQLString,
            resolve: (parent) => {
                return new Date(parent.createdAt).toISOString();
            },
        },
    },
});
exports.postResponse = new graphql_1.GraphQLObjectType({
    name: "postResponse",
    fields: {
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        post: { type: exports.postType },
    },
});
exports.postsResponse = new graphql_1.GraphQLObjectType({
    name: "postsResponse",
    fields: {
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        posts: { type: new graphql_1.GraphQLList(exports.postType) },
    },
});
