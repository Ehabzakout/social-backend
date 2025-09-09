"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../../utils/common/enum");
exports.userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 10,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 10,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        required: function () {
            if (this.userAgent === enum_1.USER_AGENT.google)
                return false;
            return true;
        },
    },
    credentialUpdatedAt: Date,
    gender: { type: String, enum: enum_1.GENDER, default: enum_1.GENDER.male },
    role: { type: String, enum: enum_1.SYS_ROLE, default: enum_1.SYS_ROLE.user },
    userAgent: { type: String, enum: enum_1.USER_AGENT, default: enum_1.USER_AGENT.local },
    otp: { type: String, length: 6 },
    otpExpiredAt: { type: Date },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema
    .virtual("fullName")
    .get(function () {
    return `${this.firstName} ${this.lastName}`;
})
    .set(function (value) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName;
    this.lastName = lName;
});
