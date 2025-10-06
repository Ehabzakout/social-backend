import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../utils/error";

export const isValid = (schema: ZodType) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const data = { ...req.body, ...req.params, ...req.query };

		const { success, error } = schema.safeParse(data);

		if (success === false) {
			const errorMessage = error.issues.map((issue) => ({
				path: issue.path[0],
				message: issue.message,
			}));
			throw new BadRequestError("Validation Error", errorMessage);
		}
		next();
	};
};
