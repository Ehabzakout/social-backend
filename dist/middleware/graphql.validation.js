"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGraphQl = void 0;
const utils_1 = require("../utils");
const isValidGraphQl = (schema, args) => {
    const { success, error } = schema.safeParse(args);
    const errorMessage = error?.issues.map((issue) => issue.message);
    if (success !== true)
        throw new utils_1.BadRequestError(JSON.stringify(errorMessage));
};
exports.isValidGraphQl = isValidGraphQl;
