// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // console.log("Authenticating");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });
    if (!user && !admin) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userType = admin ? "admin" : "user";
    // console.log("Auth middle", user);
    req.user = user || admin;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
