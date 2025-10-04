import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactory } from "./factory";
import { PostRepository } from "../../DB/model/post/post-repository";
import { BadRequestError, NotFoundError, REACTION } from "../../utils";
import { FALSE_VALUES } from "../../constants";

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
		const userId = req.user?._id;
		if (!id) {
			throw new BadRequestError("You should send post id");
		}

		const post = await this.postRepository.getOneById(id);
		if (!post) throw new NotFoundError("can't found post");

		const reactIndex = post?.reactions.findIndex(
			(react) => react.userId.toString() == userId?.toString()
		);
		if (reactIndex === -1) {
			const react = { reaction, userId };
			await this.postRepository.updateOne(
				{ _id: id },
				{ $push: { reactions: react } }
			);
		} else if (FALSE_VALUES.includes(reaction)) {
			this.postRepository.updateOne(
				{ _id: id, "reactions.userId": userId },
				{ $pull: { reactions: post.reactions[reactIndex] } }
			);
		} else {
			await this.postRepository.updateOne(
				{ _id: id, "reactions.userId": userId },
				{
					"reactions.$.reaction": reaction,
				}
			);
		}

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
				],
			}
		);
		if (!post) throw new NotFoundError("Can't found post");

		return res
			.status(200)
			.json({ message: "Get post successfully", success: true, post });
	};
}

export default new PostService();
