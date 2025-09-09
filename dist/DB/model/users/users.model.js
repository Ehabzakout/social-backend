"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const users_schema_1 = require("./users.schema");
exports.User = (0, mongoose_1.model)("User", users_schema_1.userSchema);
