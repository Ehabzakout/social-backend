export class AppError extends Error {
	constructor(message: string, public statusCode: number) {
		super(message);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409);
	}
}

export class NotAuthorizedError extends AppError {
	constructor(message: string) {
		super(message, 401);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string) {
		super(message, 400);
	}
}
