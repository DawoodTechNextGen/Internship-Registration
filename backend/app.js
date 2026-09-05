const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { createDbConnection, connection } = require("./config/connection");
const { initDb } = require("./config/initDb");
const registerRouter = require("./routes/register.route");
const techRouter = require("./routes/tech.route");
const bootcampRouter = require("./routes/bootcamp.route");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
createDbConnection();

// Create any missing tables from the .sql files in /sql
initDb();

// Routes
app.use(registerRouter);
app.use(techRouter);
app.use(bootcampRouter);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running successfully" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
