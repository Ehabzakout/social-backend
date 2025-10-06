"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const post_repository_1 = require("../../DB/model/post/post-repository");
const utils_1 = require("../../utils");
const reactions_provider_1 = __importDefault(require("../../utils/common/provider/reactions-provider"));
class PostService {
    postRepository = new post_repository_1.PostRepository();
    create = async (req, res) => {
        const createPostDTO = req.body;
        const post = new factory_1.PostFactory().create(createPostDTO, req.user);
        const createdPost = await this.postRepository.create(post);
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            createdPost,
        });
    };
    addReact = async (req, res) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user._id.toString();
        if (!id || !userId) {
            throw new utils_1.BadRequestError("You should send id");
        }
        await (0, reactions_provider_1.default)({ repo: this.postRepository, id, userId, reaction });
        return res.sendStatus(204);
    };
    getSpecificPost = async (req, res) => {
        const { id } = req.params;
        if (!id)
            throw new utils_1.BadRequestError("Send post Id");
        const post = await this.postRepository.getOne({ _id: id }, {}, {
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
        });
        if (!post)
            throw new utils_1.NotFoundError("Can't found post");
        return res
            .status(200)
            .json({ message: "Get post successfully", success: true, post });
    };
    deletePost = async (req, res) => {
        const { id } = req.params;
        const existedPost = await this.postRepository.getOne({ _id: id });
        if (!existedPost)
            throw new utils_1.NotFoundError("Can't found post");
        if (existedPost.userId.toString() !== req.user?._id.toString())
            throw new utils_1.ForbiddenError("You aren't authorized to delete this post");
        await this.postRepository.deleteOne({ _id: id });
        return res
            .status(200)
            .json({ message: "Post deleted successfully", success: true });
    };
}
exports.default = new PostService();
