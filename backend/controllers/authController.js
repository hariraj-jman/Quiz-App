// controllers/authController.js
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register new user or admin
const register = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  console.log(username, email, password, isAdmin);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (isAdmin) {
      const admin = await prisma.admin.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res
        .status(201)
        .json({ token, username: admin.username, userType: "admin" });
    } else {
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      const token = jwt.sign(
        { email: user.email, time: Date() },
        process.env.JWT_SECRET,
        { expiresIn: "4hr" }
      );
      res
        .status(201)
        .json({ token, username: user.username, userType: "user" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error registering user/admin" });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const adminUser = await prisma.admin.findUnique({
    where: { email },
  });
  console.log(adminUser, user);
  if (!user && !adminUser) {
    return res.status(404).json({ error: "User not found" });
  }
  let isMatch = false;
  let userType = false;
  let username = "";

  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
    userType = "user";
    username = user.username;
  } else {
    userType = "admin";
    username = adminUser.username;
    isMatch = await bcrypt.compare(password, adminUser.password);
  }

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: user?.email || adminUser.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "4h",
    }
  );

  res.json({ token, userType, username });
};

const verifyToken = async (req, res) => {
  const { token } = req.body;
  console.log("Verifying: ", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded :", decoded);
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });
    console.log(decoded.email, user, admin);
    if (!user && !admin) {
      return res.json({});
    }
    const userType = admin ? "admin" : "user";
    const username = admin ? admin.username : user.username;

    res.json({ user: user || admin, userType, username });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  register,
  verifyToken,
  login,
};
