"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProvider = updateProvider;
const error_1 = require("../../error");
async function updateProvider(repo, id, userId, data) {
    const document = await repo.getOne({ _id: id });
    if (!document)
        throw new error_1.NotFoundError("Can't found comment");
    if (document.isDeleted)
        throw new error_1.ForbiddenError("document has been freezed");
    if (document.userId.toString() !== userId)
        throw new error_1.NotAuthorizedError("you are Not authorized to update");
    await repo.updateOne({ _id: id }, data);
}
