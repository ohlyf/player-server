const express = require("express");
const { userController } = require("../controller/index");
const { userValidator } = require("../middleware/validator");
const { verifyToken } = require("../utils/jwt");
const multer = require("multer");

const router = express.Router();

const upload = multer({ dest: "public/" });
router
  .post("/register", userValidator.register, userController.register)
  .post("/login", userValidator.login, userController.login)
  .put("/user", verifyToken, userValidator.update, userController.update)
  .post("/avatar", verifyToken, upload.single("avatar"), userController.avatar);
module.exports = router;
