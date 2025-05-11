const jwt = require("jsonwebtoken");

const signToken = (email, id, expiry) => {
    console.log(email, id, expiry)
    const token = jwt.sign({
        data: {email, id},  
    }, process.env.JWT_SECRET, {expiresIn: expiry ? `${expiry - Date.now()}s` : "24h"});
    console.log(token)
    return token
}
module.exports = {signToken}