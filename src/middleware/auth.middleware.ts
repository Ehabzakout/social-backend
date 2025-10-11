import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError, NotFoundError } from "../utils/error";
import { verifyToken } from "../utils/token";
import { UserRepository } from "../DB/model/users/user-repository";
import { IUser } from "../utils/common/interfaces/user";
import { JwtPayload } from "jsonwebtoken";

export async function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { accesstoken } = req.headers;
	if (!accesstoken) throw new NotAuthorizedError("You are not logged in");
	const payload = verifyToken(accesstoken as string);
	const User = new UserRepository();
	const existedUser = await User.getOneById(payload.id);
	if (!existedUser) throw new NotFoundError("user not found");

	if (existedUser.credentialUpdatedAt > new Date(payload.iat! * 1000))
		throw new NotAuthorizedError("Expired logged in");
	req.user = existedUser;
	next();
}
