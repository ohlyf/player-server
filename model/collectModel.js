const mongoose = require("mongoose");
const baseModel = require("./baseModel");

// 收藏
const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    require: true,
    ref: "User",
  },
  video: {
    type: mongoose.ObjectId,
    require: true,
    ref: "Video",
  },
  ...baseModel,
});

module.exports = collectionSchema;
