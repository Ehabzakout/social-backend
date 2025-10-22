import { Schema } from "mongoose";
import { IUser } from "../../../utils/common/interfaces/user";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";
import { sendEmail } from "../../../utils/email";
import { User } from "./users.model";
import { ForbiddenError } from "../../../utils";

export const userSchema = new Schema<IUser>(
	{
		firstName: {
			type: String,
			minLength: 3,
			maxLength: 10,
			trim: true,
			required: true,
		},
		lastName: {
			type: String,
			minLength: 3,
			maxLength: 10,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			required: true,
		},
		password: {
			type: String,
			trim: true,
			minLength: 8,

			required: function () {
				if (this.userAgent === USER_AGENT.google) return false;
				return true;
			},
		},

		credentialUpdatedAt: Date,
		gender: { type: String, enum: GENDER, default: GENDER.male },
		role: { type: String, enum: SYS_ROLE, default: SYS_ROLE.user },
		userAgent: { type: String, enum: USER_AGENT, default: USER_AGENT.local },
		otp: { type: String, length: 6 },
		otpExpiredAt: { type: Date },
		isVerified: { type: Boolean, default: false },
		loginWith2factor: { type: Boolean, default: false },
		blockedUsers: [Schema.Types.ObjectId],
		requests: [{ type: Schema.Types.ObjectId, ref: "Request", unique: true }],
		friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema
	.virtual("fullName")
	.get(function () {
		return `${this.firstName} ${this.lastName}`;
	})
	.set(function (value: string) {
		const [fName, lName] = value.split(" ");
		this.firstName = fName as string;
		this.lastName = lName as string;
	});

userSchema.pre("save", async function () {
	if (this.userAgent !== "google" && this.isNew) {
		await sendEmail({
			subject: "Confirm email",
			to: this.email,
			html: `<h2>Your OTP is : ${this.otp} </h2>`,
		});
	}
});
