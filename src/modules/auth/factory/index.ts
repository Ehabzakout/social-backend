import { SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";
import { hashText } from "../../../utils/hash";
import { expiryTime, generateOtp } from "../../../utils/otp";
import { RegisterDTO } from "../auth.dto";
import { UserEntity } from "../entity";

export class AuthFactoryService {
	async register(registerDto: RegisterDTO) {
		const user = new UserEntity();
		user.fullName = registerDto.fullName;
		user.email = registerDto.email;
		user.gender = registerDto.gender;
		user.password = await hashText(registerDto.password);
		user.credentialUpdatedAt = Date.now() as unknown as Date;
		user.otp = generateOtp();
		user.otpExpiredAt = expiryTime();
		user.role = SYS_ROLE.user;
		user.phone = user.phone as string;
		user.userAgent = USER_AGENT.local;
		return user;
	}
}
