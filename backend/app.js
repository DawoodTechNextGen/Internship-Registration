const express = require("express");
const { createDbConnection } = require("./config/connection");
const cors = require("cors");
const bodyParser = require("body-parser");
const registerRouter = require("./routes/register.route");
const techRouter = require("./routes/tech.route");
const customHeaderSet = require("./middleware/customHeader");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(customHeaderSet);
// CORS setup
// app.use(
//   cors({
//     origin: process.env.Allow_ORIGIN, // frontend origin
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// Preflight handling
// app.options("*", cors());

createDbConnection();

app.use(registerRouter);
app.use(techRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port: ${process.env.PORT}`);
});
