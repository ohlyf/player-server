const fs = require("fs");
const { promisify } = require("util");
const { User } = require("../model/index");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/jwt");

const rename = promisify(fs.rename);
const register = async (req, res) => {
  const userModel = new User(req.body);
  const dbBack = await userModel.save();
  let user = dbBack.toJSON();
  delete user.password;
  res.status(201).json({
    user,
  });
};

const login = async (req, res) => {
  let dbBack = await User.findOne(req.body);
  if (!dbBack) {
    res.status(402).json({ error: "邮箱或者密码不正确" });
  }
  dbBack = dbBack.toJSON();
  dbBack.token = await createToken(dbBack);
  res.status(200).json({ dbBack });
};

const list = async (req, res) => {
  console.log(req.user.userinfo);
  res.status(200).json(req.body);
};

// 用户修改
const update = async (req, res) => {
  const id = req.user.userinfo._id;
  const updateData = await User.findByIdAndUpdate(id, req.body, { new: true });
  console.log(updateData);
  res.send();
};

// 用户头像上传
const avatar = async (req, res) => {
  const fileArr = req.file.originalname.split(".");
  const fileType = fileArr[fileArr.length - 1];

  try {
    await rename(
      "./public/" + req.file.filename,
      "./public/" + req.file.filename + "." + fileType
    );
    res.status(201).json({ filePath: req.file.filename + "." + fileType });
  } catch (error) {
    res.status(500).json({ err: error });
  }
  res.send(afterFix);
};
module.exports = { register, login, list, update, avatar };
