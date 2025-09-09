"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.expiryTime = expiryTime;
function generateOtp() {
    return Math.floor(Math.random() * 90000 + 10000);
}
function expiryTime(time = 5 * 60 * 1000) {
    return (Date.now() + time);
}
