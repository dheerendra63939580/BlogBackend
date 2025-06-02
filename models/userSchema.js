const mongoose = require("mongoose");
const { countryNameEnum } = require("../utils/constant/countryNameEnum");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    country: {
        type: String,
        enum: countryNameEnum
    },
    isGmailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpiry: {
        type: Number
    },
    googleId: {
        type: String,
    },
    avatar: {
        type: String
    },
}, {timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = {User}