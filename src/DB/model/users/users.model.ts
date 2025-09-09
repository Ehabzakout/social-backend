import { model } from "mongoose";
import { userSchema } from "./users.schema";

export const User = model("User", userSchema);
