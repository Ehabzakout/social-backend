import nodemailer from "nodemailer";
import envConfig from "../../config/env/env-config";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: envConfig.EMAIL,
		pass: envConfig.PASSWORD,
	},
});

export async function sendEmail({ subject, to, html }: MailOptions) {
	await transporter.sendMail({
		subject,
		from: `Social App <${envConfig.EMAIL}>`,
		to,
		html,
	});
}
