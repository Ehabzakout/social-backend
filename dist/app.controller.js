"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bootstrap;
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
function bootstrap(app, express) {
    app.use(express.json());
    app.use("/auth", auth_controller_1.default);
    app.use("/{*dummy}", (req, res) => {
        res.status(404).json({ message: "route not found", success: false });
    });
}
