"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("./../../DB/model/users/user-repository");
const error_1 = require("../../utils/error");
const factory_1 = require("./factory");
class AuthService {
    userRepository = new user_repository_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res, next) => {
        const registerDTO = req.body;
        const existedUser = await this.userRepository.getOne({
            email: registerDTO.email,
        });
        if (existedUser)
            throw new error_1.ConflictError("User already exist");
        const user = this.authFactoryService.register(registerDTO);
        const newUser = await this.userRepository.create(user);
        return res
            .status(201)
            .json({ message: "user created successfully", success: true, newUser });
    };
}
exports.default = new AuthService();
