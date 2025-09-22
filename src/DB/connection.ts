import mongoose from "mongoose";
import envConfig from "../config/env/env-config";

export async function connectDB() {
	await mongoose
		.connect(envConfig.DB_URL as string)
		.then(() => {
			console.log("connected to DB");
		})
		.catch((error) => {
			console.log("fail to connect DB", error);
		});
}
