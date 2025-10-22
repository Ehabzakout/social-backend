import { GraphQLID, GraphQLObjectType } from "graphql";
import { postResponse, postsResponse } from "./post-type";

import { getAllPosts, getSpecificPost } from "./post-graphql.service";

export const postQuery = {
	getPost: {
		type: postResponse,
		args: {
			id: { type: GraphQLID },
		},
		resolve: getSpecificPost,
	},

	getPosts: {
		type: postsResponse,
		resolve: getAllPosts,
	},
};
