const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidater");
const {createBlog, getBlogs, getBlogById, updateBlog, handleLike, deleteBlog} = require("../controllers/blogController")
const router = express.Router();

router.route("/blog")
    .post(tokenValidation, createBlog)
    .get(getBlogs)
    .patch(tokenValidation, updateBlog)

router.get("/blog/:blogId/:wantOnlyUserId", getBlogById);
router.patch("/blog/like", tokenValidation, handleLike);
router.delete("/blog/:blogId", tokenValidation, deleteBlog);

module.exports = router;