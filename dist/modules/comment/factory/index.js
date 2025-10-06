"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFactory = void 0;
const entity_1 = require("../entity");
class CommentFactory {
    createComment = async ({ commentDTO, userId, postId, existedComment, }) => {
        const comment = new entity_1.CommentEntity();
        comment.content = commentDTO.content;
        comment.postId = postId || existedComment?.postId;
        comment.userId = userId;
        comment.reactions = [];
        comment.parentId = existedComment?._id;
        return comment;
    };
}
exports.CommentFactory = CommentFactory;
