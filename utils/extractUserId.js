const jwt = require("jsonwebtoken")
module.exports.extractUserId = (token) => {
  try {
    if (!token) return "";
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.data?.id || "";
  } catch (err) {
    console.log(err)
    return "";
  }
};