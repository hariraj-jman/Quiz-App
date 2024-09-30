const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/v1/authRoutes");
const quizRoutes = require("./routes/v1/quizRoutes");
const userRoutes = require("./routes/v1/userRoutes");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const fs = require("fs");
const path = require("path");
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {});

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
