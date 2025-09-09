import { type Express } from "express";
import authRouter from "./modules/auth/auth.controller";
import connectDB from "./DB/connection";
import { config } from "dotenv";

export default function bootstrap(app: Express, express: any) {
	config({ path: "./config/dev.env" });
	connectDB();
	app.use(express.json());
	app.use("/auth", authRouter);
	app.use("/{*dummy}", (req, res) => {
		res.status(404).json({ message: "route not found", success: false });
	});
}
