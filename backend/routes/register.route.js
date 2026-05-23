const express = require("express");
const {
  registerIntern,
  getRegistrationCount,
} = require("../controller/register.controller");
const registerRouter = express.Router();

registerRouter.post("/api/registration", registerIntern);
registerRouter.get("/api/count-register", getRegistrationCount);

module.exports = registerRouter;
