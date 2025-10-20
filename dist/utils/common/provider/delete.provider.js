"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneProvider = deleteOneProvider;
const error_1 = require("../../error");
async function deleteOneProvider(repo, id, userId) {
    const document = await repo.getOneById(id);
    if (!document)
        throw new error_1.NotFoundError("Can't found to delete");
    if (document.userId.toString() !== userId)
        throw new error_1.ForbiddenError("Not authorize to delete this");
    await repo.deleteOne({ _id: id });
}
