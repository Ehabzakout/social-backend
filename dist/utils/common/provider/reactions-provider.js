"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReactionProvider;
const constants_1 = require("../../../constants");
const error_1 = require("../../error");
async function ReactionProvider({ repo, id, userId, reaction, }) {
    const document = await repo.getOne({ _id: id });
    if (!document)
        throw new error_1.NotFoundError("can't found ");
    const reactIndex = document?.reactions.findIndex((react) => react.userId.toString() == userId);
    if (reactIndex === -1) {
        const react = { reaction, userId };
        await repo.updateOne({ _id: id }, { $push: { reactions: react } });
    }
    else if (constants_1.FALSE_VALUES.includes(reaction)) {
        repo.updateOne({ _id: id, "reactions.userId": userId }, { $pull: { reactions: document.reactions[reactIndex] } });
    }
    else {
        await repo.updateOne({ _id: id, "reactions.userId": userId }, {
            "reactions.$.reaction": reaction,
        });
    }
}
