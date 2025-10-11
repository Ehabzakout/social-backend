import { GENDER } from "../../utils/common/enum";

export interface RegisterDTO {
	fullName: string;
	email: string;
	password: string;
	phone?: string;
	gender: GENDER;
}

export interface LoginDTO {
	email: string;
	password: string;
}

export interface VerifyOtpDTO {
	email: string;
	otp: string;
}

export interface SendOtpDTO {
	email: string;
}

export interface UpdatePasswordDTO {
	password: string;
	newPassword: string;
	rePassword: string;
}

export interface ResetPasswordDTO {
	email: string;
	otp: string;
	newPassword: string;
	rePassword: string;
}

export interface UpdateUserInfo {
	firstName?: string;
	lastName?: string;
	gender?: GENDER;
}
