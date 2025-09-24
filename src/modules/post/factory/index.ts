import { IUser } from "../../../utils";
import { PostEntity } from "../entity";
import { CreatePostDTO } from "../post.dto";

export class PostFactory {
	create(postDTO: CreatePostDTO, user: IUser) {
		const post = new PostEntity();
		post.userId = user._id;
		post.content = postDTO.content;
		post.reactions = [];
		if (postDTO.attachments) post.attachment = postDTO.attachments;

		return post;
	}
}
