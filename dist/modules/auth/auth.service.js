"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
const auth_provider_1 = require("./providers/auth.provider");
const email_1 = require("../../utils/email");
const users_model_1 = require("../../DB/model/users/users.model");
class AuthService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res, next) => {
        const registerDTO = req.body;
        const existedUser = await this.userRepository.getOne({
            email: registerDTO.email,
        });
        if (existedUser)
            throw new utils_1.ConflictError("User already exist");
        const user = await this.authFactoryService.register(registerDTO);
        const newUser = await this.userRepository.create(user);
        return res.status(201).json({
            message: "user created successfully",
            success: true,
            id: newUser._id,
        });
    };
    // login
    login = async (req, res) => {
        const { email, password } = req.body;
        const existedUser = await this.userRepository.getOne({ email });
        if (!existedUser)
            throw new utils_1.NotFoundError("user not found");
        const match = await (0, utils_1.compareText)(password, existedUser.password);
        if (!match)
            throw new utils_1.NotAuthorizedError("Invalid credentials");
        if (!existedUser.isVerified)
            throw new utils_1.NotAuthorizedError("Verify your account");
        if (existedUser.loginWith2factor) {
            const otp = (0, utils_1.generateOtp)();
            const otpExpiredAt = (0, utils_1.expiryTime)();
            existedUser.otp = otp;
            existedUser.otpExpiredAt = otpExpiredAt;
            await existedUser.save();
            (0, email_1.sendEmail)({
                subject: "Social App OTP",
                to: email,
                html: `<h3>Your Otp is : ${otp}</h3>`,
            });
            return res
                .status(200)
                .json({ message: "OTP has been sent successfully", success: true });
        }
        const accessToken = (0, utils_1.generateToken)({
            data: {
                id: existedUser.id,
                name: existedUser.firstName,
                role: String(existedUser.role),
            },
            options: { expiresIn: "1d" },
        });
        return res
            .status(200)
            .json({ message: "logged in successfully", success: true, accessToken });
    };
    // Verify Account
    verifyAccount = async (req, res) => {
        const verifyAccountDTO = req.body;
        await auth_provider_1.authProvider.checkOTP(verifyAccountDTO);
        this.userRepository.updateOne({ email: verifyAccountDTO.email }, { isVerified: true, $unset: { otp: "", otpExpiredAt: "" } });
        return res.sendStatus(204);
    };
    // Send OTP
    sendOTP = async (req, res) => {
        const { email } = req.body;
        const otp = (0, utils_1.generateOtp)();
        const otpExpiredAt = (0, utils_1.expiryTime)();
        const existedUser = await this.userRepository.findOneAndUpdate({ email }, { otp, otpExpiredAt });
        if (!existedUser)
            throw new utils_1.NotFoundError("Can't found user");
        (0, email_1.sendEmail)({
            subject: "Social App OTP",
            to: email,
            html: `<h3>Your Otp is : ${otp}</h3>`,
        });
        return res.sendStatus(204);
    };
    // Activate 2-step verification
    activate2Auth = async (req, res) => {
        const user = req.user;
        const { otp } = req.body;
        if (!user?.otp)
            throw new utils_1.BadRequestError("You should send OTP to your Email first");
        if (user?.otp && user?.otp !== otp)
            throw new utils_1.BadRequestError("invalid OTP");
        if (user.otpExpiredAt && new Date() > new Date(user.otpExpiredAt))
            throw new utils_1.BadRequestError("OTP Expired");
        if (!user.loginWith2factor) {
            await users_model_1.User.updateOne({ _id: user._id }, {
                loginWith2factor: true,
                credentialUpdatedAt: Date.now(),
                $unset: { otp: "", otpExpiredAt: "" },
            });
        }
        else {
            await users_model_1.User.updateOne({ _id: user._id }, {
                loginWith2factor: false,
                credentialUpdatedAt: Date.now(),
                $unset: { otp: "", otpExpiredAt: "" },
            });
        }
        return res
            .status(200)
            .json({ message: "You 2 factor auth login updated", success: true });
    };
    // login with otp
    loginWithOtp = async (req, res) => {
        const { email, otp } = req.body;
        const existedUser = await this.userRepository.getOne({ email });
        if (!existedUser?.loginWith2factor)
            throw new utils_1.ForbiddenError("Login with 2 factor is not activated");
        if (!existedUser)
            throw new utils_1.NotFoundError("Can't found user");
        if (!existedUser.otp)
            throw new utils_1.NotAuthorizedError("You should send otp to your email first");
        if (existedUser.otp != otp)
            throw new utils_1.NotAuthorizedError("Invalid otp");
        if (existedUser.otpExpiredAt && existedUser?.otpExpiredAt < new Date())
            throw new utils_1.ForbiddenError("expired otp");
        delete existedUser.otp;
        delete existedUser.otpExpiredAt;
        await existedUser.save();
        const accessToken = (0, utils_1.generateToken)({
            data: {
                id: existedUser.id,
                name: existedUser.firstName,
                role: String(existedUser.role),
            },
            options: { expiresIn: "1d" },
        });
        return res
            .status(200)
            .json({ message: "logged in successfully", success: true, accessToken });
    };
}
exports.default = new AuthService();
