const express = require("express");
const { signInByGoogle } = require("../controllers/userController");
const router = express.Router();

router.post("/sign-in-by-google", signInByGoogle)

module.exports = router