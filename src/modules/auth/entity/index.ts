import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";

export class UserEntity {
	public fullName!: string;
	public email!: string;
	public password!: string;
	public phone?: string;
	public credentialUpdatedAt!: Date;
	public userAgent!: USER_AGENT;
	public gender!: GENDER;
	public role!: SYS_ROLE;
	public otp?: string;
	public otpExpiredAt?: Date;
	public isVerified!: boolean;
}
