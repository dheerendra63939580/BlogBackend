const {Blog} = require("../models/blogSchema")
const {User} = require("../models/userSchema")
const createBlog = async (req, res) => {
    try {
        const userId = req.userId
        const {title, content} = req.body;
        const user = await User.findById(userId);
        if(!user)
            return res.status(400).json({
                success: false,
                message: "User does not exists"
        })
        const blog = await Blog.create({
            userId,
            title,
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

const getBlogs = async (req, res) => {
    try {
         const blogs = await Blog.find({})
         .select("-content")
         .populate("userId", "name createdAt updatedAt avatar _id");
         res.status(200).json({
            success: true, 
            data: {blogs},
            message: "Blogs found successfully"
         })

    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getBlogById = async (req, res) => {
    try {
        const { blogId, wantOnlyUserId } = req.params;
        let fieldsToPopulate = wantOnlyUserId === "true" ? "_id" : "name createdAt updatedAt avatar _id";
        const blog = await Blog.findById(blogId).select("title likes content createdAt updatedAt").populate("userId", fieldsToPopulate);
        if(!blog)
            return res.status(400).json({
                success: false, 
                message: "Blog not found"
            })
        return res.status(200).json({
            success: true,
            message: "Blog found successfully",
            data: blog
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const updateBlog = async (req, res) => {
    try {
        const userId = req.userId
        const {blogId, content, title } = req.body;
        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(400).json({
                success: false, 
                message: "Blog does not exist"
            })
        }
        if(blog.userId._id.toString() !== userId)
            return res.status(400),json({
                success: false,
                message: "UserId does not match"
            })
        blog.content = content;
        blog.title = title;
        await blog.save({new: true});
        res.status(201).json({
            success: true,
            message: "Blog updated successfully"
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const handleLike = async (req, res) => {
    try {
        const userId = req.userId;
        const {blogId} = req.body;
        const user = await User.findById(userId);
        const blog = await Blog.findById(blogId);
        if(!user)
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        if(!blog)
            return res.status(400).json({
                success: false,
                message: "Blog does not exist"
            });
        const isAlreadyLiked = blog.likes.includes(userId);
        if(isAlreadyLiked) {
            blog.likes = blog?.likes?.filter((id) => id.toString() !== userId);
        } else {
            blog?.likes?.push(userId);
        }
        await blog.save()
        console.log(userId, blog.likes);
        console.log(blog.likes.includes(userId))
        res.status(200).json({
            success: true,
            message: "success"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    handleLike
}