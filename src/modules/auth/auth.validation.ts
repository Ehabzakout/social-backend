import z from "zod";
import { GENDER } from "../../utils";

import {
	LoginDTO,
	RegisterDTO,
	UpdatePasswordDTO,
	UpdateUserInfo,
	VerifyOtpDTO,
} from "./auth.dto";

export const registerSchema = z.object<RegisterDTO>({
	email: z.email().trim() as unknown as string,
	fullName: z.string().min(4).trim() as unknown as string,
	password: z.string().min(8).trim() as unknown as string,
	gender: z.enum(GENDER) as unknown as GENDER,
	phone: z.string().length(11).optional() as unknown as string,
});

export const loginSchema = z.object<LoginDTO>({
	email: z.email() as unknown as string,
	password: z.string().min(8) as unknown as string,
});

export const verifyOtpSchema = z.object<VerifyOtpDTO>({
	email: z.email() as unknown as string,
	otp: z.string().length(6) as unknown as string,
});

export const otpSchema = z.object({
	otp: z.string().length(6) as unknown as string,
});

export const emailSchema = z.object({
	email: z.email() as unknown as string,
});

export const updatePasswordSchema = z
	.object<UpdatePasswordDTO>({
		password: z.string().min(8) as unknown as string,
		newPassword: z.string().min(8) as unknown as string,
		rePassword: z.string() as unknown as string,
	})
	.refine((values) => values.newPassword === values.rePassword, {
		path: ["rePassword"],
		error: "Your new password doesn't match",
	});

export const updateUserInfo = z
	.object<UpdateUserInfo>({
		firstName: z.string().min(3).optional() as unknown as string,
		lastName: z.string().min(3).optional() as unknown as string,
		gender: z.enum(GENDER).optional() as unknown as GENDER,
	})
	.strict()
	.refine((values) => Object.keys(values).length > 0, {
		error: "You should send at least one value",
	});
