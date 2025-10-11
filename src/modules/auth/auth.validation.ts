import z from "zod";
import { GENDER } from "../../utils";

import { LoginDTO, RegisterDTO, VerifyOtpDTO } from "./auth.dto";

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
