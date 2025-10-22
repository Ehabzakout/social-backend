import { ZodType } from "zod";
import { BadRequestError } from "../utils";

export const isValidGraphQl = (schema: ZodType, args: any) => {
	const { success, error } = schema.safeParse(args);
	const errorMessage = error?.issues.map((issue) => issue.message);

	if (success !== true) throw new BadRequestError(JSON.stringify(errorMessage));
};
