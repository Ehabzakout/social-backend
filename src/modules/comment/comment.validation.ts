import z from "zod";
import { commentDTO } from "./comment.dto";

export const commentSchema = z.object<commentDTO>({
	content: z.string().trim().min(3, {
		error: "Content should be at least 3 char",
	}) as unknown as string,
});
