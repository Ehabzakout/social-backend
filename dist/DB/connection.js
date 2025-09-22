"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = __importDefault(require("../config/env/env-config"));
async function connectDB() {
    await mongoose_1.default
        .connect(env_config_1.default.DB_URL)
        .then(() => {
        console.log("connected to DB");
    })
        .catch((error) => {
        console.log("fail to connect DB", error);
    });
}
