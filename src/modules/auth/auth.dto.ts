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
