"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    constructor() { }
    register(req, res, next) {
        return res
            .status(200)
            .json({ message: "success", success: true, data: req.body });
    }
}
exports.default = new AuthService();
