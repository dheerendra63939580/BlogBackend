const jwt = require("jsonwebtoken")
const tokenValidation = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")?.[1];
        if(!token)
            return res.status(401).json({
                sucess: false,
                message: "Invalid token"
            })
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err)
                return res.status(401).json({
                sucess: false,
                message: "Invalid token"
            });
            req.userId = decoded?.data?.id;
            next()
        });  
    } catch(err) {
        res.status(500).json({
            sucess: false,
            message: "Internal server error"
        })
    }
}

module.exports = { tokenValidation }