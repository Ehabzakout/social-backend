"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bootstrap;
const DB_1 = require("./DB");
const dotenv_1 = require("dotenv");
const express_rate_limit_1 = require("express-rate-limit");
const modules_1 = require("./modules");
function bootstrap(app, express) {
    (0, dotenv_1.config)();
    (0, DB_1.connectDB)();
    const limiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 5 * 60 * 1000,
        limit: 5,
        message: { message: "You had too many request", success: false },
        statusCode: 429,
        skipSuccessfulRequests: true,
    });
    app.use(express.json());
    app.use("/auth", limiter, modules_1.authRouter);
    app.use("/user", modules_1.userRouter);
    app.use("/posts", modules_1.postRouter);
    app.use("/comment", modules_1.commentRouter);
    app.use("/{*dummy}", (req, res) => {
        res.status(404).json({ message: "route not found", success: false });
    });
    app.use((error, req, res, next) => {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
            details: error.errorDetails,
        });
    });
}
