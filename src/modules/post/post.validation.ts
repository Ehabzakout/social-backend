import z from "zod";
import { REACTION } from "../../utils";

export const postSchema = z
	.object({
		content: z
			.string()
			.min(20, { error: "Your content should be larger than 20 char" })
			.optional(),
		attachments: z
			.array(
				z
					.instanceof(File)
					.refine((file) => file.size <= 4 * 1024 * 1024, {
						message: "Max file size is 4MB",
					})
			)
			.min(1)
			.max(4)
			.optional(),
	})
	.refine(
		(values) =>
			values.content || (values.attachments && values.attachments.length > 0),
		{ path: ["content"], message: "you should add content or attachments" }
	);

export const addReactSchema = z.object({
	reaction: z.enum(REACTION),
});
