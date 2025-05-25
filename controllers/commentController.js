const { Blog } = require("../models/blogSchema");
const { User } = require("../models/userSchema");

const createComment = async (req, res) => {

    try {
        const { comment, userId, postId } = req.body;
        const user = await User.findById(userId);
        const blog = await Blog.findById(postId)
        if(!user)
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        if(!blog)
            return res.status(400).json({
                success: false,
                message: "Blog does not exist"
            })
        await Comment.create({
            userId,
            postId,
            comment 
        });

        return res.status(201).json({
            success: true,
            message: "Comment added successfully"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { createComment }