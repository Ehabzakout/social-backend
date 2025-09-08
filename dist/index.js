"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_controller_1 = __importDefault(require("./app.controller"));
const app = (0, express_1.default)();
const port = 3000;
(0, app_controller_1.default)(app, express_1.default);
app.listen(port, () => {
    console.log("Server is running on port: ", port);
});
