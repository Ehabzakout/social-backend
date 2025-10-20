import { CommentRepository } from "../../../DB/model/comment/comment.reposatory";
import { PostRepository } from "../../../DB/model/post/post-repository";
import { ForbiddenError, NotAuthorizedError, NotFoundError } from "../../error";

export async function updateProvider(
	repo: CommentRepository | PostRepository,
	id: string,
	userId: string,
	data: { [key: string]: any }
) {
	const document = await repo.getOne({ _id: id });
	if (!document) throw new NotFoundError("Can't found comment");
	if (document.isDeleted) throw new ForbiddenError("document has been freezed");
	if (document.userId.toString() !== userId)
		throw new NotAuthorizedError("you are Not authorized to update");
	await repo.updateOne({ _id: id }, data);
}
