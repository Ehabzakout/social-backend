"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.NotAuthorizedError = exports.ConflictError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class NotAuthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
