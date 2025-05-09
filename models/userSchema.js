const mongoose = require("mongoose");

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
        type: string
    },
    isVerifiedByGoogle: {
        type: Boolean,
        default: false
    },
    country: {
        type: String
    }
})