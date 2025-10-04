import { Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import postService from "./post.service";
import { addReactSchema, postSchema } from "./post.validation";

const router = Router();

router.post("/add", isAuthenticated, isValid(postSchema), postService.create);
router.patch("/:id", isAuthenticated, postService.addReact);
router.get("/:id", postService.getSpecificPost);
export default router;
