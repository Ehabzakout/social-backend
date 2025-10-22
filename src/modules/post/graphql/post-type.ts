import {
	GraphQLBoolean,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import { userType } from "../../users/graphql/user-type";

export const postType = new GraphQLObjectType({
	name: "Post",
	fields: {
		_id: { type: GraphQLID },
		content: { type: GraphQLString },
		userId: { type: userType },

		reactions: {
			type: new GraphQLList(
				new GraphQLObjectType({
					name: "reactions",
					fields: {
						userId: { type: GraphQLID },
						reaction: { type: GraphQLInt },
					},
				})
			),
		},
		createdAt: {
			type: GraphQLString,
			resolve: (parent) => {
				return new Date(parent.createdAt).toISOString();
			},
		},
		updatedAt: {
			type: GraphQLString,
			resolve: (parent) => {
				return new Date(parent.createdAt).toISOString();
			},
		},
	},
});

export const postResponse = new GraphQLObjectType({
	name: "postResponse",
	fields: {
		message: { type: GraphQLString },
		success: { type: GraphQLBoolean },
		post: { type: postType },
	},
});

export const postsResponse = new GraphQLObjectType({
	name: "postsResponse",
	fields: {
		message: { type: GraphQLString },
		success: { type: GraphQLBoolean },
		posts: { type: new GraphQLList(postType) },
	},
});
