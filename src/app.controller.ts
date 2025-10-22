import type { Express, Request, Response, NextFunction } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./app.grphql";
import { connectDB } from "./DB";
import { config } from "dotenv";
import { rateLimit } from "express-rate-limit";
import { type AppError } from "./utils/error";
import {
	authRouter,
	userRouter,
	postRouter,
	commentRouter,
	requestRouter,
} from "./modules";
import { GraphQLError } from "graphql";

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
	app.use("/request", requestRouter);
	app.all(
		"/graphql",
		createHandler({
			schema,
			formatError: (error: Readonly<Error | GraphQLError>) => {
				const e = error as GraphQLError;
				return {
					message: e?.message || (error as Error).message,
					path: e?.path,
					details: e?.originalError,
				} as unknown as GraphQLError;
			},
			context: (req) => {
				const token = req.headers["accesstoken"];
				return { token };
			},
		})
	);
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
