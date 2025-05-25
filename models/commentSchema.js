const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Blog"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);
module.export = { Comment }