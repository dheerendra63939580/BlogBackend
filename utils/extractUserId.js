module.exports.extractUserId = (token) => {
  console.log("token", token)
  try {
    if (!token) return "";
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.data?.id || "";
  } catch {
    return "";
  }
};