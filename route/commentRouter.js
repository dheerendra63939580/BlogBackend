const express = require("express");
const { createComment } = require("../controllers/commentController");
const { tokenValidation } = require("../middlewares/tokenValidater");

const router = express.Router();

router.route("/comment")
    .post(tokenValidation, createComment)

module.exports = router;