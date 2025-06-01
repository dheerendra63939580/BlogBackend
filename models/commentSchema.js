const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Blog"
    },
    comments: [
        {
            comment: {
            type: String,
            required: true,
            trim: true
            },
            userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
    }
]
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment }