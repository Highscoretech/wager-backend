const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

const protect = async (req, res, next) => {
  const SECRET = `highscoretechBringwexsingthebestamoung23498hx93`;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }else{
    const token = authorization.split(" ")[1];
    try {
      const decodeToken = jwt.verify(token, SECRET);
      let pop = await Admin.find({user_id:decodeToken._id})
      req.user = pop[0]
      next();
    } catch (error) {
      return res.status(401).json({message:"Not authorized to access this route"});
    }
  }
};


 
module.exports = {
    protect
}