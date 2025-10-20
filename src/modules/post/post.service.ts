import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactory } from "./factory";
import { PostRepository } from "../../DB/model/post/post-repository";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../utils";

import ReactionProvider from "../../utils/common/provider/reactions-provider";
import { updateProvider } from "../../utils/common/provider/update.provider";

class PostService {
	private readonly postRepository = new PostRepository();
	create = async (req: Request, res: Response) => {
		const createPostDTO: CreatePostDTO = req.body;

		const post = new PostFactory().create(createPostDTO, req.user!);

		const createdPost = await this.postRepository.create(post);
		return res.status(201).json({
			message: "Post created successfully",
			success: true,
			createdPost,
		});
	};

	addReact = async (req: Request, res: Response) => {
		const { id } = req.params;
		const { reaction } = req.body;
		const userId = req.user!._id.toString();
		if (!id || !userId) {
			throw new BadRequestError("You should send id");
		}
		await ReactionProvider({ repo: this.postRepository, id, userId, reaction });

		return res.sendStatus(204);
	};

	getSpecificPost = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) throw new BadRequestError("Send post Id");

		const post = await this.postRepository.getOne(
			{ _id: id },
			{},
			{
				populate: [
					{
						path: "userId",
						select: ["fullName", "firstName", "lastName", "-_id"],
					},
					{
						path: "comments",
						select: ["content", "userId", "postId", "parentIds"],
						match: { parentId: null },
					},
				],
			}
		);
		if (!post) throw new NotFoundError("Can't found post");
		if (post.isDeleted) throw new NotFoundError("this post has been deleted");
		return res
			.status(200)
			.json({ message: "Get post successfully", success: true, post });
	};

	deletePost = async (req: Request, res: Response) => {
		const { id } = req.params;
		const existedPost = await this.postRepository.getOne({ _id: id });

		if (!existedPost) throw new NotFoundError("Can't found post");
		if (existedPost.userId.toString() !== req.user?._id.toString())
			throw new ForbiddenError("You aren't authorized to delete this post");

		await this.postRepository.deleteOne({ _id: id });

		return res
			.status(200)
			.json({ message: "Post deleted successfully", success: true });
	};

	// Freeze Post
	freezePost = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) throw new BadRequestError("Not found post id");
		const userId = req.user!._id.toString();

		const post = await this.postRepository.getOneById(id);
		if (!post) throw new NotFoundError("Can't found Post");
		if (post.userId.toString() !== userId)
			throw new ForbiddenError("Not authorize to delete this");

		if (post.isDeleted) {
			await this.postRepository.updateOne(
				{ _id: id },
				{ isDeleted: false, $unset: { deletedAt: "" } }
			);
		} else
			await this.postRepository.updateOne(
				{ _id: id },
				{ isDeleted: true, deletedAt: Date.now() }
			);
		return res.sendStatus(204);
	};

	// Update Post

	updatePost = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) throw new BadRequestError("Send comment id");
		const userId = req.user!._id.toString();
		console.log(userId);
		await updateProvider(this.postRepository, id, userId, req.body);
		return res
			.status(200)
			.json({ message: "Post Updated successfully", success: true });
	};
}

export default new PostService();
