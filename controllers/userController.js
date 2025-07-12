const { User } = require("../models/userSchema");
const { sendEmailVerificationToken } = require("../utils/nodeMailer");
const { signToken } = require("../utils/signToken");
const { verifyGoogleToken } = require("../utils/verifyGoogleUserToken");
const crypto = require("crypto");
const bcrypt = require("bcrypt")
const saltRounds = process.env.SALT_ROUND

const signInByGoogle = async (req, res) => {
    const {userToken, country} = req.body;
    try {
        const userData = await verifyGoogleToken(userToken);
        if(!userData)
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        if(userData.aud !== process.env.GOOGLE_CLIENT_ID)
            return res.status(400).json({
                success: false,
                message: "Invalid client id"
        })
        const isUserExist = await User.findOne({$or: [{googleId: userData.sub}, {email: userData.email}]});
        if(isUserExist) {
            const token = signToken(isUserExist.email, isUserExist._id, userData.exp);
            return res.status(200).json({
                success: true,
                data: {token},
                message: "Logged in successfully"
            })
        }
        if(!isUserExist && !country)
            return res.status(400).json({
                success: false,
                message: "Account does not exist. Please sign up."
            })
        const user = await User.create({
            name: userData.name,
            email: userData.email,
            googleId: userData.sub,
            avatar: userData.picture,
            isVerified: true,
            country,

        })
        const token = signToken(user.email, user._id, userData.exp);
        return res.status(200).json({
            success: true,
            data: {token},
            messge: "Logged in successfully"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("name avatar");
        if(!user)
            return res.status(400).json({
                success: false,
                message: "User not found"
        });
        return res.status(200).json({
            success: true, 
            data: user,
            message: "Profile found successfully"
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password, country} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser)
            return res.status(400).json({
                success: false,
                message: "User already exist with same email"
        });
        const hashedPassword = await bcrypt.hash(password, +saltRounds);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
        const verificationResponse = await sendEmailVerificationToken(email,verificationToken);
        console.log(verificationResponse)
        if(!verificationResponse.success)
            return res.status(400).json({
                success: false,
                message: verificationResponse.message
        });
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            country,
            verificationToken,
            verificationTokenExpiry
        });
        return res.status(201).json({
            success: true,
            message: "Account created successfully. An email is send to your gmail account, please verify your account"
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const {verificationToken} = req.params;
        const user = await User.findOne({verificationToken});
        if(!user)
            return res.status(400).json({
                success: false,
                message: "User not found"
        });
        if(user.verificationToken < Date.now()) {
            const verificationToken = crypto.randomBytes(32).toString("hex");
            const verificationTokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
            const verificationResponse = await sendEmailVerificationToken(user.email,verificationToken);
            user.verificationToken = verificationToken;
            user.verificationTokenExpiry = verificationTokenExpiry;
            await user.save();
            return res.send("Verificaton code was expired, again verification token has been send. Please verify again!")
        }
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        user.isGmailVerified = true;
        await user.save();
        return res.send("Your gmail has benn verified. You can procedd to login");
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user || !user.isGmailVerified)
            return res.status(400).json({
                success: false,
                message: !user.isGmailVerified ? "Email is not verified" : "Invalid credentials"
        });
        const match = await bcrypt.compare(password, user.password);
        if(!match)
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
        })
        const token = signToken(user.email, user._id);
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {token}
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    signInByGoogle,
    getProfile,
    registerUser,
    verifyEmail,
    userLogin
}