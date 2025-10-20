"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freezeProvider = freezeProvider;
const error_1 = require("../../error");
async function freezeProvider(repo, id, userId) {
    const document = await repo.getOneById(id);
    if (!document)
        throw new error_1.NotFoundError("Can't found");
    if (document.userId.toString() !== userId)
        throw new error_1.ForbiddenError("Not authorize to delete this");
    if (document.isDeleted) {
        await repo.updateOne({ _id: id }, { isDeleted: false, $unset: { deletedAt: "" } });
    }
    else
        await repo.updateOne({ _id: id }, { isDeleted: true, deletedAt: Date.now() });
}
