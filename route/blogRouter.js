const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidater");
const {createBlog} = require("../controllers/blogController")
const router = express.Router();

router.post("/blog", tokenValidation, createBlog);

module.exports = router;