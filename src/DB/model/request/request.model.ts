import { model } from "mongoose";
import requestSchema from "./request.schema";

export const Request = model("Request", requestSchema);
