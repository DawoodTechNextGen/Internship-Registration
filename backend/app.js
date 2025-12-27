const express = require("express");
const { createDbConnection } = require("./config/connection");
const cors = require("cors");

const bodyParser = require("body-parser");
const registerRouter = require("./routes/register.route");
const techRouter = require("./routes/tech.route");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
createDbConnection();

app.use(registerRouter);
app.use(techRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port: ${process.env.PORT}`);
});
