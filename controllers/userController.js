const { User } = require("../models/userSchema");
const { signToken } = require("../utils/signToken");
const { verifyGoogleToken } = require("../utils/verifyGoogleUserToken");

const signInByGoogle = async (req, res) => {
    const {userToken} = req.body;
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
        const isUserExist = await User.findOne({googleId: userData.sub});
        if(isUserExist) {
            const token = signToken(isUserExist.email, isUserExist._id, userData.exp);
            return res.status(200).json({
                success: true,
                data: {token},
                message: "Logged in successfully"
            })
        }
        const user = await User.create({
            name: userData.name,
            email: userData.email,
            googleId: userData.sub,
            avatar: userData.image,
            isVerified: true,

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

module.exports = {
    signInByGoogle,
}