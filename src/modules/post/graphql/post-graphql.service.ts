import { PostRepository } from "../../../DB/model/post/post-repository";

import { isAuthenticate } from "../../../middleware/graphql-auth";
import { isValidGraphQl } from "../../../middleware/graphql.validation";
import { NotFoundError } from "../../../utils";
import { postSchema } from "./post.validation";

export const getSpecificPost = async (
	parent: any,
	args: { id: string },
	context: any
) => {
	const { user } = await isAuthenticate(context);

	isValidGraphQl(postSchema, args);

	const postRepo = new PostRepository();
	const post = await postRepo.getOne(
		{ _id: args.id },
		{},
		{
			populate: [
				{
					path: "userId",
					select: ["email", "_id", "firstName", "lastName"],
				},
			],
		}
	);

	if (!post) throw new NotFoundError("Can't found post");
	return { message: "done", success: true, post };
};

export const getAllPosts = async () => {
	const postRepo = new PostRepository();
	const posts = await postRepo.getMany(
		{},
		{},
		{
			populate: [
				{
					path: "userId",
					select: ["email", "_id", "firstName", "lastName"],
				},
			],
		}
	);

	return { message: "done", success: true, posts };
};
