import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { postQuery } from "./modules/post/graphql/post-query";

export const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQuery",
		fields: {
			...postQuery,
		},
	}),
});
