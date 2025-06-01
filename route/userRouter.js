const express = require("express");
const { signInByGoogle, getProfile, registerUser, verifyEmail, userLogin } = require("../controllers/userController");
const {tokenValidation} = require("../middlewares/tokenValidater.js")
const router = express.Router();

router.post("/sign-in-by-google", signInByGoogle);
router.get("/profile", tokenValidation, getProfile);
router.post("/signup", registerUser);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/login", userLogin)

module.exports = router