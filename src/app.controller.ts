import { type Express } from "express";
import authRouter from "./modules/auth/auth.controller";
export default function bootstrap(app: Express, express: any) {
	app.use(express.json());
	app.use("/auth", authRouter);
	app.use("/{*dummy}", (req, res) => {
		res.status(404).json({ message: "route not found", success: false });
	});
}
