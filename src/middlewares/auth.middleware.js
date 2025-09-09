const jwt = require("jsonwebtoken");


const verifyAccessToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized - No Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized - Invalid/Expired Token" });
  }
};


module.exports = { verifyAccessToken};
