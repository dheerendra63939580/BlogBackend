const express = require("express");
const { createComment } = require("../controllers/commentController");
const { tokenValidation } = require("../middlewares/tokenValidater");

const route = express.Router();

route.route("/comment")
    .post(tokenValidation, createComment)
