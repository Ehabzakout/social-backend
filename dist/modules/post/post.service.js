"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const post_repository_1 = require("../../DB/model/post/post-repository");
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
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
        const userId = req.user?._id;
        if (!id) {
            throw new utils_1.BadRequestError("You should send post id");
        }
        const post = await this.postRepository.getOneById(id);
        if (!post)
            throw new utils_1.NotFoundError("can't found post");
        const reactIndex = post?.reactions.findIndex((react) => react.userId.toString() == userId?.toString());
        if (reactIndex === -1) {
            const react = { reaction, userId };
            await this.postRepository.updateOne({ _id: id }, { $push: { reactions: react } });
        }
        else if (constants_1.FALSE_VALUES.includes(reaction)) {
            this.postRepository.updateOne({ _id: id, "reactions.userId": userId }, { $pull: { reactions: post.reactions[reactIndex] } });
        }
        else {
            await this.postRepository.updateOne({ _id: id, "reactions.userId": userId }, {
                "reactions.$.reaction": reaction,
            });
        }
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
            ],
        });
        if (!post)
            throw new utils_1.NotFoundError("Can't found post");
        return res
            .status(200)
            .json({ message: "Get post successfully", success: true, post });
    };
}
exports.default = new PostService();
