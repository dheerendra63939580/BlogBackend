const {Blog} = require("../models/blogSchema")
const {User} = require("../models/userSchema")
const createBlog = async (req, res) => {
    console.log("hit blog")
    try {
        const userId = req.userId
        const {content} = req.body;
        const user = await User.findById(userId);
        if(!user)
            return res.status(400).json({
                success: false,
                message: "User does not exists"
        })
        const blog = await Blog.create({
            userId,
            content
        });
        user.blogs.push(blog._id);
        await user.save()
        res.status(201).json({
            success: true,
            message: "Blog created successfully"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    createBlog
}