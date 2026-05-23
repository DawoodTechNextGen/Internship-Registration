const express = require("express");
const getTechs = require("../controller/tech.controller");
const techRouter = express.Router();

techRouter.get("/api/technologies", getTechs);

module.exports = techRouter;
