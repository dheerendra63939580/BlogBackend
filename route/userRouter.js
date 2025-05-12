const express = require("express");
const { signInByGoogle, getProfile } = require("../controllers/userController");
const {tokenValidation} = require("../middlewares/tokenValidater.js")
const router = express.Router();

router.post("/sign-in-by-google", signInByGoogle);
router.get("/profile", tokenValidation, getProfile)

module.exports = router