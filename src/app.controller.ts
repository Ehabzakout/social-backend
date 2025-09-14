import type { Express, Request, Response, NextFunction } from "express";

import { connectDB } from "./DB";
import { config } from "dotenv";
import { type AppError } from "./utils/error";
import { authRouter, userRouter } from "./modules";

export default function bootstrap(app: Express, express: any) {
	config({ path: "./config/dev.env" });
	connectDB();
	app.use(express.json());
	app.use("/auth", authRouter);
	app.use("/user", userRouter);

	app.use("/{*dummy}", (req, res) => {
		res.status(404).json({ message: "route not found", success: false });
	});

	app.use(
		(error: AppError, req: Request, res: Response, next: NextFunction) => {
			return res.status(error.statusCode || 500).json({
				message: error.message || "Internal Server Error",
				success: false,
				details: error.errorDetails,
				stack: error.stack,
			});
		}
	);
}
