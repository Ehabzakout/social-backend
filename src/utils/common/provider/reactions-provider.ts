import { CommentRepository } from "../../../DB/model/comment/comment.reposatory";
import { PostRepository } from "../../../DB/model/post/post-repository";
import { FALSE_VALUES } from "../../../constants";
import { BadRequestError, NotFoundError } from "../../error";

type TReactionProvider = {
	repo: CommentRepository | PostRepository;
	id: string;
	userId: string;
	reaction: string;
};
export default async function ReactionProvider({
	repo,
	id,
	userId,
	reaction,
}: TReactionProvider) {
	const document = await repo.getOneById(id);
	if (!document) throw new NotFoundError("can't found ");

	const reactIndex = document?.reactions.findIndex(
		(react) => react.userId.toString() == userId
	);
	if (reactIndex === -1) {
		const react = { reaction, userId };
		await repo.updateOne({ _id: id }, { $push: { reactions: react } });
	} else if (FALSE_VALUES.includes(reaction)) {
		repo.updateOne(
			{ _id: id, "reactions.userId": userId },
			{ $pull: { reactions: document.reactions[reactIndex] } }
		);
	} else {
		await repo.updateOne(
			{ _id: id, "reactions.userId": userId },
			{
				"reactions.$.reaction": reaction,
			}
		);
	}
}
