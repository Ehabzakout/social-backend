"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_reposatory_1 = require("./../../DB/model/comment/comment.reposatory");
const utils_1 = require("../../utils");
const post_repository_1 = require("../../DB/model/post/post-repository");
const factory_1 = require("./factory");
const reactions_provider_1 = __importDefault(require("../../utils/common/provider/reactions-provider"));
const DB_1 = require("../../DB");
const email_1 = require("../../utils/email");
const update_provider_1 = require("../../utils/common/provider/update.provider");
class CommentService {
    commentRepository = new comment_reposatory_1.CommentRepository();
    postRepository = new post_repository_1.PostRepository();
    commentFactory = new factory_1.CommentFactory();
    userRepository = new DB_1.UserRepository();
    // create comment function
    create = async (req, res) => {
        // get params from request
        const { postId, id } = req.params;
        const userId = req.user?._id;
        const commentDTO = req.body;
        if (!postId)
            throw new utils_1.BadRequestError("Can't read post id");
        if (!userId)
            throw new utils_1.NotAuthorizedError("You are not logged in");
        // get post from database
        const post = await this.postRepository.getOneById(postId);
        if (!post)
            throw new utils_1.NotFoundError("Can't found post");
        let existedComment = undefined;
        // check if this is a new comment or not
        if (id) {
            existedComment = await this.commentRepository.getOneById(id);
            if (!existedComment)
                throw new utils_1.NotFoundError("Can't find comment with this id");
            if (existedComment.isDeleted)
                throw new utils_1.NotFoundError("this comment has been deleted");
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
                if (!user)
                    throw new utils_1.BadRequestError("user you tagged not found");
                newComment.mentions?.push(user._id);
                (0, email_1.sendEmail)({
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
    getSpecificComment = async (req, res) => {
        const { id } = req.params;
        if (!id)
            throw new utils_1.BadRequestError("comment id not found");
        const existedComment = await this.commentRepository.getOneById(id, {}, { populate: [{ path: "replies" }] });
        if (!existedComment)
            throw new utils_1.NotFoundError("Can't found comment");
        return res.status(200).json({
            message: "Get comment successfully",
            success: true,
            existedComment,
        });
    };
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const deletedComment = await this.commentRepository.getOne({
            _id: id,
        }, {}, { populate: { path: "postId", select: ["userId"] } });
        if (!deletedComment)
            throw new utils_1.NotFoundError("Can't found comment");
        if (deletedComment.userId.toString() != req.user?._id.toString() &&
            deletedComment.postId.userId.toString() !=
                req.user?._id.toString())
            throw new utils_1.ForbiddenError("you are not authorized to delete comment");
        await this.commentRepository.deleteOne({ _id: deletedComment._id });
        return res
            .status(200)
            .json({ message: "Comment deleted successfully", success: true });
    };
    addReaction = async (req, res) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user?._id.toString();
        if (!id || !userId)
            throw new utils_1.BadRequestError("messing data");
        await (0, reactions_provider_1.default)({
            repo: this.commentRepository,
            id,
            userId,
            reaction,
        });
        return res.sendStatus(204);
    };
    // Freeze comment
    freezeComment = async (req, res) => {
        const userId = req.user._id.toString();
        const { id } = req.params;
        if (!id)
            throw new utils_1.BadRequestError("missing comment id");
        const existedComment = await this.commentRepository.getOneById(id);
        if (!existedComment)
            throw new utils_1.NotFoundError("Can't found comment");
        if (existedComment?.userId.toString() !== userId &&
            existedComment.postId.userId.toString() !== userId)
            throw new utils_1.ForbiddenError("Not authorized to delete comment ");
        if (existedComment.isDeleted) {
            await this.commentRepository.updateOne({ _id: id }, { $set: { isDeleted: false } });
            return res
                .status(200)
                .json({ message: "Your comment has been restored", success: true });
        }
        else {
            await this.commentRepository.updateOne({ _id: id }, { $set: { isDeleted: true } });
            return res.status(200).json({
                message: "Your comment has been deleted successfully",
                success: true,
            });
        }
    };
    // Update Comment
    updateComment = async (req, res) => {
        const { id } = req.params;
        if (!id)
            throw new utils_1.BadRequestError("Send comment id");
        const userId = req.user._id.toString();
        await (0, update_provider_1.updateProvider)(this.commentRepository, id, userId, req.body);
        return res
            .status(200)
            .json({ message: "Updated successfully", success: true });
    };
}
exports.default = new CommentService();
