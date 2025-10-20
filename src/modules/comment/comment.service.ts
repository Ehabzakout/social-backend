import { Request, Response } from "express";
import { CommentRepository } from "./../../DB/model/comment/comment.reposatory";
import {
	BadRequestError,
	ForbiddenError,
	IComment,
	IPost,
	NotAuthorizedError,
	NotFoundError,
} from "../../utils";
import { PostRepository } from "../../DB/model/post/post-repository";
import { commentDTO } from "./comment.dto";
import { CommentFactory } from "./factory";
import ReactionProvider from "../../utils/common/provider/reactions-provider";
import { UserRepository } from "../../DB";
import { sendEmail } from "../../utils/email";
import { updateProvider } from "../../utils/common/provider/update.provider";

class CommentService {
	private commentRepository = new CommentRepository();
	private postRepository = new PostRepository();
	private commentFactory = new CommentFactory();
	private userRepository = new UserRepository();
	// create comment function
	create = async (req: Request, res: Response) => {
		// get params from request
		const { postId, id } = req.params;
		const userId = req.user?._id;
		const commentDTO: commentDTO = req.body;

		if (!postId) throw new BadRequestError("Can't read post id");
		if (!userId) throw new NotAuthorizedError("You are not logged in");

		// get post from database
		const post = await this.postRepository.getOneById(postId);
		if (!post) throw new NotFoundError("Can't found post");

		let existedComment: IComment | any = undefined;

		// check if this is a new comment or not
		if (id) {
			existedComment = await this.commentRepository.getOneById(id);
			if (!existedComment)
				throw new NotFoundError("Can't find comment with this id");
			if (existedComment.isDeleted)
				throw new NotFoundError("this comment has been deleted");
		}

		// Get new comment from factory
		const newComment = await this.commentFactory.createComment({
			commentDTO,
			userId,
			postId: post._id,
			existedComment,
		});

		// Send email for tagged user
		if (commentDTO.mentions && commentDTO.mentions?.length > 0) {
			newComment.mentions = [];
			for (let userId of commentDTO.mentions) {
				const user = await this.userRepository.getOneById(userId);
				if (!user) throw new BadRequestError("user you tagged not found");
				newComment.mentions?.push(user._id);
				sendEmail({
					subject: `${req.user?.firstName} Mentioned you`,
					to: user.email,
					html: `<p>${req.user?.firstName} mentioned you in his comment ${commentDTO.content}</p>`,
				});
			}
		}
		// add comment to database
		const createdComment = await this.commentRepository.create(newComment);

		// Response
		return res.status(201).json({
			message: "comment add successfully",
			success: true,
			createdComment,
		});
	};

	getSpecificComment = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) throw new BadRequestError("comment id not found");
		const existedComment = await this.commentRepository.getOneById(
			id,
			{},
			{ populate: [{ path: "replies" }] }
		);
		if (!existedComment) throw new NotFoundError("Can't found comment");
		return res.status(200).json({
			message: "Get comment successfully",
			success: true,
			existedComment,
		});
	};

	deleteComment = async (req: Request, res: Response) => {
		const { id } = req.params;

		const deletedComment = await this.commentRepository.getOne(
			{
				_id: id,
			},
			{},
			{ populate: { path: "postId", select: ["userId"] } }
		);
		if (!deletedComment) throw new NotFoundError("Can't found comment");

		if (
			deletedComment.userId.toString() != req.user?._id.toString() &&
			(deletedComment.postId as unknown as IPost).userId.toString() !=
				req.user?._id.toString()
		)
			throw new ForbiddenError("you are not authorized to delete comment");
		await this.commentRepository.deleteOne({ _id: deletedComment._id });
		return res
			.status(200)
			.json({ message: "Comment deleted successfully", success: true });
	};

	addReaction = async (req: Request, res: Response) => {
		const { id } = req.params;
		const { reaction } = req.body;
		const userId = req.user?._id.toString();

		if (!id || !userId) throw new BadRequestError("messing data");

		await ReactionProvider({
			repo: this.commentRepository,
			id,
			userId,
			reaction,
		});

		return res.sendStatus(204);
	};

	// Freeze comment
	freezeComment = async (req: Request, res: Response) => {
		const userId = req.user!._id.toString();
		const { id } = req.params;
		if (!id) throw new BadRequestError("missing comment id");
		const existedComment = await this.commentRepository.getOneById(id);
		if (!existedComment) throw new NotFoundError("Can't found comment");
		if (
			existedComment?.userId.toString() !== userId &&
			(existedComment.postId as unknown as IPost).userId.toString() !== userId
		)
			throw new ForbiddenError("Not authorized to delete comment ");

		if (existedComment.isDeleted) {
			await this.commentRepository.updateOne(
				{ _id: id },
				{ $set: { isDeleted: false } }
			);
			return res
				.status(200)
				.json({ message: "Your comment has been restored", success: true });
		} else {
			await this.commentRepository.updateOne(
				{ _id: id },
				{ $set: { isDeleted: true } }
			);
			return res.status(200).json({
				message: "Your comment has been deleted successfully",
				success: true,
			});
		}
	};

	// Update Comment
	updateComment = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) throw new BadRequestError("Send comment id");
		const userId = req.user!._id.toString();
		await updateProvider(this.commentRepository, id, userId, req.body);
		return res
			.status(200)
			.json({ message: "Updated successfully", success: true });
	};
}

export default new CommentService();
