const { Blog } = require("../models/blogSchema");
const { Comment } = require("../models/commentSchema");
const { User } = require("../models/userSchema");

const createComment = async (req, res) => {

    try {
        const userId = req.userId;
        const { comment, blogId } = req.body;
        const user = await User.findById(userId);
        const blog = await Blog.findById(blogId)
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
        let commentedBlog = await Comment.findOne({blogId});
        if(commentedBlog) {
            commentedBlog.comments.push({userId,comment})
        } else {
            commentedBlog = new Comment({
                blogId,
                comments: [
                    {
                        userId,
                        comment
                    }
                ]
            })
        }
        await commentedBlog.save();

        return res.status(201).json({
            success: true,
            message: "Comment added successfully"
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { createComment }