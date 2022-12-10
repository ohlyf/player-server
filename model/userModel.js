const mongoose = require("mongoose");
const md5 = require("md5");

const baseModel = require("./baseModel");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: (value) => md5(value),
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  cover: {
    type: String,
    default: null,
  },
  channelDes: {
    type: String,
    default: null,
  },
  subscribeCount: {
    type: Number,
    default: 0,
  },
  ...baseModel,
});

module.exports = userSchema;
