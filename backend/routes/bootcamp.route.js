const express = require("express");
const {
  registerBootcamp,
  getBootcampCount,
} = require("../controller/bootcamp.controller");
const bootcampRouter = express.Router();

bootcampRouter.post("/api/bootcamp-registration", registerBootcamp);
bootcampRouter.get("/api/count-bootcamp", getBootcampCount);

module.exports = bootcampRouter;
