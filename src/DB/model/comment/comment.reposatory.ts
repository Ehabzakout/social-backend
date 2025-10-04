import { IComment } from "../../../utils/common/interfaces/comment";
import { abstractRepository } from "../../abstract-repository";
import { Comment } from "./comment.model";

export class CommentRepository extends abstractRepository<IComment> {
	constructor() {
		super(Comment);
	}
}
