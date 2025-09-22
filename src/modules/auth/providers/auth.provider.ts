import { UserRepository } from "../../../DB";
import { BadRequestError, NotFoundError } from "../../../utils";
import { VerifyAccountDTO } from "../auth.dto";

export const authProvider = {
	async checkOTP({ email, otp }: VerifyAccountDTO) {
		const userRepository = new UserRepository();
		const existedUser = await userRepository.getOne({ email });
		if (!existedUser) throw new NotFoundError("User not exist");
		if (existedUser.otp !== otp) throw new BadRequestError("Invalid otp");
		if (existedUser.otpExpiredAt! < new Date())
			throw new BadRequestError("Expired OTP");
	},
};
