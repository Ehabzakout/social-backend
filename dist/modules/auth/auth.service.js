"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
const auth_provider_1 = require("./providers/auth.provider");
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
}
exports.default = new AuthService();
