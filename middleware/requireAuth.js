const jwt = require("jsonwebtoken");
const User = require("../model/User")

const requireAuth = async (req, res, next) => {
  const SECRET = `highscoretechBringwexsingthebestamoung23498hx93`;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  } else {
    const token = authorization.split(" ")[1];
    try {
      const { _id } = jwt.verify(token, SECRET);
      req.id = await User.findOne({user_id:_id}).select("user_id")
      next()
    } catch (error) {
      res.status(404).json({ error: "Request not authorized" });
    }
  }
};

module.exports = requireAuth;