import { IPost } from "../../../utils/common/interfaces/post";
import { abstractRepository } from "../../abstract-repository";
import Post from "./post.model";

export class PostRepository extends abstractRepository<IPost> {
	constructor() {
		super(Post);
	}
}
