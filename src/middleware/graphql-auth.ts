import { UserRepository } from "../DB";
import { NotAuthorizedError, NotFoundError, verifyToken } from "../utils";

export const isAuthenticate = async (context) => {
	const { token } = context;

	if (!token) throw new NotAuthorizedError("You are not logged in");
	const payload = verifyToken(token as string);
	const User = new UserRepository();
	const existedUser = await User.getOneById(payload.id);
	if (!existedUser) throw new NotFoundError("user not found");

	if (existedUser.credentialUpdatedAt > new Date(payload.iat! * 1000))
		throw new NotAuthorizedError("Expired logged in");
	context.user = existedUser;
	return context;
};
