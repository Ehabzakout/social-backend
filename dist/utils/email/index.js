"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = __importDefault(require("../../config/env/env-config"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: env_config_1.default.EMAIL,
        pass: env_config_1.default.PASSWORD,
    },
});
async function sendEmail({ subject, to, html }) {
    await transporter.sendMail({
        subject,
        from: `Social App <${env_config_1.default.EMAIL}>`,
        to,
        html,
    });
}
