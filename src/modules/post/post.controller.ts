import { Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import postService from "./post.service";
import { postSchema } from "./post.validation";
import { commentRouter } from "..";

const router = Router();

router.use(
	"/:postId/comment",
	isAuthenticated,

	commentRouter
);
router.post("/add", isAuthenticated, isValid(postSchema), postService.create);
router.patch("/:id", isAuthenticated, postService.addReact);
router.get("/:id", postService.getSpecificPost);
router.delete("/:id", isAuthenticated, postService.deletePost);
export default router;
