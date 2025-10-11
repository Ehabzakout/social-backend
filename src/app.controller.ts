import type { Express, Request, Response, NextFunction } from "express";

import { connectDB } from "./DB";
import { config } from "dotenv";
import { rateLimit } from "express-rate-limit";
import { type AppError } from "./utils/error";
import { authRouter, userRouter, postRouter, commentRouter } from "./modules";

export default function bootstrap(app: Express, express: any) {
	config();
	connectDB();
	const limiter = rateLimit({
		windowMs: 5 * 60 * 1000,
		limit: 5,
		message: { message: "You had too many request", success: false },
		statusCode: 429,
		skipSuccessfulRequests: true,
	});
	app.use(express.json());
	app.use("/auth", limiter, authRouter);
	app.use("/user", userRouter);
	app.use("/posts", postRouter);
	app.use("/comment", commentRouter);
	app.use("/{*dummy}", (req, res) => {
		res.status(404).json({ message: "route not found", success: false });
	});

	app.use(
		(error: AppError, req: Request, res: Response, next: NextFunction) => {
			return res.status(error.statusCode || 500).json({
				message: error.message || "Internal Server Error",
				success: false,
				details: error.errorDetails,
			});
		}
	);
}
