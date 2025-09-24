import { model } from "mongoose";
import postSchema from "./post-schema";

const Post = model("Post", postSchema);

export default Post;
