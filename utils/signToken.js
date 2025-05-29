const jwt = require("jsonwebtoken");

const signToken = (email, id, expiry) => {
    const token = jwt.sign({
        data: {email, id},  
    }, process.env.JWT_SECRET, {expiresIn: expiry ? `${expiry - Math.floor(Date.now() / 1000)}s` : "24h"});
    return token
}
module.exports = {signToken}