"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestFactory = void 0;
const entity_1 = require("../entity");
const utils_1 = require("../../../utils");
class RequestFactory {
    friendRequest = (id, receiverId) => {
        const request = new entity_1.RequestEntity();
        request.sender = id;
        request.receiver = receiverId;
        request.status = utils_1.REQUEST_STATUS.pending;
        request.type = utils_1.REQUEST_TYPE.friend;
        return request;
    };
}
exports.RequestFactory = RequestFactory;
