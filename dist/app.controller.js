"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bootstrap;
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const connection_1 = __importDefault(require("./DB/connection"));
const dotenv_1 = require("dotenv");
function bootstrap(app, express) {
    (0, dotenv_1.config)({ path: "./config/dev.env" });
    (0, connection_1.default)();
    app.use(express.json());
    app.use("/auth", auth_controller_1.default);
    app.use("/{*dummy}", (req, res) => {
        res.status(404).json({ message: "route not found", success: false });
    });
}
