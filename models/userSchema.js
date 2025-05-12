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
        type: String
    },
    country: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
    },
    avatar: {
        type: String
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }],
}, {timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = {User}