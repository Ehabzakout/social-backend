"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
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
        return res
            .status(201)
            .json({ message: "user created successfully", success: true, newUser });
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
        return res
            .status(200)
            .json({ message: "logged in successfully", success: true });
    };
}
exports.default = new AuthService();
