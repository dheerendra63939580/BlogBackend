const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidater");
const {createBlog, getBlogs, getBlogById} = require("../controllers/blogController")
const router = express.Router();

router.route("/blog")
    .post(tokenValidation, createBlog)
    .get(getBlogs)

router.get("/blog/:blogId", getBlogById)

module.exports = router;