import { ObjectId } from "mongoose";
import { GENDER, SYS_ROLE, USER_AGENT } from "../enum";

export interface IUser {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	fullName?: string;
	email: string;
	password: string;
	phone?: string;
	credentialUpdatedAt: Date;
	userAgent: USER_AGENT;
	gender: GENDER;
	role: SYS_ROLE;
	otp?: string;
	otpExpiredAt?: Date;
	isVerified: boolean;
	loginWith2factor: boolean;
}

declare module "jsonwebtoken" {
	interface JwtPayload {
		id: string;
		name: string;
		role: string;
	}
}

declare module "express" {
	interface Request {
		user?: IUser;
	}
}
