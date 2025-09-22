import { config } from "dotenv";

config();
const envConfig = {
	PORT: process.env.PORT,
	DB_URL: process.env.DB_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	EMAIL: process.env.EMAIL,
	PASSWORD: process.env.PASSWORD,
};

export default envConfig;
