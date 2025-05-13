const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidater");
const {createBlog, getBlogs} = require("../controllers/blogController")
const router = express.Router();

router.post("/blog", tokenValidation, createBlog);
router.get("/blog", getBlogs);

module.exports = router;