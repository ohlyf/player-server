const mongoose = require("mongoose");
const baseModel = require("./baseModel");

// 关注
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
