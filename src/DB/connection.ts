import mongoose from "mongoose";

export default async function connectDB() {
	await mongoose
		.connect(process.env.DB_URL as string)
		.then(() => {
			console.log("connected to DB");
		})
		.catch((error) => {
			console.log("fail to connect DB");
		});
}
