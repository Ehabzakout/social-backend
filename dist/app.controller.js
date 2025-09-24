"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bootstrap;
const DB_1 = require("./DB");
const dotenv_1 = require("dotenv");
const modules_1 = require("./modules");
function bootstrap(app, express) {
    (0, dotenv_1.config)();
    (0, DB_1.connectDB)();
    app.use(express.json());
    app.use("/auth", modules_1.authRouter);
    app.use("/user", modules_1.userRouter);
    app.use("/posts", modules_1.postRouter);
    app.use("/{*dummy}", (req, res) => {
        res.status(404).json({ message: "route not found", success: false });
    });
    app.use((error, req, res, next) => {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
            details: error.errorDetails,
            stack: error.stack,
        });
    });
}
