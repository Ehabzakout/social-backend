import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactory } from "./factory";
import { PostRepository } from "../../DB/model/post/post-repository";
import { BadRequestError, NotFoundError, REACTION } from "../../utils";

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
		const { reaction }: { reaction: REACTION } = req.body;
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
}

export default new PostService();
