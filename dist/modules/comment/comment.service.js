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
class CommentService {
    commentRepository = new comment_reposatory_1.CommentRepository();
    postRepository = new post_repository_1.PostRepository();
    commentFactory = new factory_1.CommentFactory();
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
        }
        // Get new comment from factory
        const newComment = await this.commentFactory.createComment({
            commentDTO,
            userId,
            postId: post._id,
            existedComment,
        });
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
}
exports.default = new CommentService();
