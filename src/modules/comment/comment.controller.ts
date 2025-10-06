import { Router } from "express";
import commentService from "./comment.service";
import { isAuthenticated, isValid } from "../../middleware";
import { commentSchema } from "./comment.validation";

const router = Router({ mergeParams: true });

router.post("/{:id}", isValid(commentSchema), commentService.create);
router.get("/:id", isAuthenticated, commentService.getSpecificComment);
router.delete("/:id", isAuthenticated, commentService.deleteComment);
router.patch("/:id", isAuthenticated, commentService.addReaction);
export default router;
