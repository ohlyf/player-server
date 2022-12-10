const express = require("express");
const { userController } = require("../controller/index");
const { userValidator } = require("../middleware/validator");
const { verifyToken } = require("../utils/jwt");

const router = express.Router();
router
  .post("/register", userValidator.register, userController.register)
  .post("/login", userValidator.login, userController.login)
  .get("/list", verifyToken, userController.list)
  .put("/", verifyToken, userValidator.update, userController.update);
module.exports = router;
