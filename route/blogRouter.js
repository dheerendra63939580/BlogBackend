const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidater");
const {createBlog, getBlogs, getBlogById, updateBlog, handleLike} = require("../controllers/blogController")
const router = express.Router();

router.route("/blog")
    .post(tokenValidation, createBlog)
    .get(getBlogs)
    .patch(tokenValidation, updateBlog)

router.get("/blog/:blogId/:wantOnlyUserId", getBlogById)
router.patch("/blog/like", tokenValidation, handleLike)

module.exports = router;