const express = require("express");
const registerIntern = require("../controller/register.controller");
const registerRouter = express.Router();

registerRouter.post("/api/registration", registerIntern);

module.exports = registerRouter;
