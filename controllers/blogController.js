const {Blog} = require("../models/blogSchema")
const {User} = require("../models/userSchema");
const { extractUserId } = require("../utils/extractUserId");
const mongoose = require("mongoose");
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
  const {page, limit} = req.query;
    try {
         const blogs = await Blog.find({}).skip((page - 1) * limit).limit(limit)
         .select("-content")
         .populate("userId", "name createdAt updatedAt avatar _id country");
         const blogWithLikes = blogs.map((value) => {
          const valueObject = value.toObject();
          const likesCount = valueObject?.likes?.length || 0;
          delete valueObject.likes
          return {...valueObject, likesCount}
         })
         const total = await Blog.countDocuments()
         res.status(200).json({
            success: true, 
            data: {blogs: blogWithLikes, total },
            message: "Blogs found successfully"
         })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getBlogById = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")?.[1];
    const userId = extractUserId(token); // assumed to return a string
    const { blogId, wantOnlyUserId } = req.params;
    const blogIdObj = new mongoose.Types.ObjectId(blogId);
   let userIdObj = null;
   if(userId)
     userIdObj = new mongoose.Types.ObjectId(userId);
    const fieldsToProject =
      wantOnlyUserId === "true"
        ? { _id: "$userInfo._id" }
        : {
            _id: "$userInfo._id",
            name: "$userInfo.name",
            avatar: "$userInfo.avatar",
            createdAt: "$userInfo.createdAt",
            updatedAt: "$userInfo.updatedAt",
            country: "$userInfo.country"
          };

    const result = await Blog.aggregate([
      { $match: { _id: blogIdObj } },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          hasUserLiked: {
            $cond: [
              { $eq: [userIdObj, null] }, // if no userId
              false,
              { $in: [userIdObj, "$likes"] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          title: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          likesCount: 1,
          hasUserLiked: 1,
          userId: fieldsToProject,
        },
      },
    ]);

    if (!result.length) {
      return res.status(400).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog found successfully",
      data: result[0],
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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
        res.status(200).json({
            success: true,
            message: isAlreadyLiked ? "Unliked blog successfully" : "Liked blog successfully"
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const {blogId} = req.params;
    const blog = await Blog.findById(blogId);
    if(!blog)
      return res.status(400).json({
        success: false,
        message: "Blog not found"
      })
    if(blog?.userId.toString() !== userId)
      return res.status(400).json({
        success: false,
        message: "Unauthorized access"
    })
    await Blog.findByIdAndDelete(blogId)
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    })
  } catch(err) {
    console.log(err);
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
    handleLike,
    deleteBlog
}