import { GENDER, SYS_ROLE, USER_AGENT } from "../enum";

export interface IUser {
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
}
