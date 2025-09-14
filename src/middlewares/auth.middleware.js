const jwt = require("jsonwebtoken");
const { prisma } = require("../../config/db");


const verifyAccessToken = async (req, res, next) => {
  const token = req.cookies?.authToken;
  console.log("Token from cookie:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.companyId = decoded;
    console.log("UserId:", decoded.userID);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userID }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check role
    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden - Admins only 🚫" });
    }

    // If admin, continue
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err);
    return res.status(403).json({ message: "Unauthorized - Invalid/Expired Token" });
  }
};

const companyVerification = async (req, res, next) => {
  try {
    const userCompanyId = req.user.companyId;

    if (!userCompanyId) {
      return res.status(400).json({ message: "No companyId in token" });
    }

    // Attach to request for later use in controllers
    req.companyId = userCompanyId;

    next();

  } catch (err) {
    console.error("Company verification error:", err);
    return res.status(500).json({ message: "Server error during company verification" });
  }
}



module.exports = { verifyAccessToken, companyVerification};
