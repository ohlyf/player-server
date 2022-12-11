const mongoose = require("mongoose");
const { mongo } = require("../config/config.default");
mongoose.set("strictQuery", false);

async function main() {
  await mongoose.connect(mongo.url);
}

main()
  .then((res) => {
    console.log("mongo连接成功");
  })
  .catch((err) => {
    console.log(err, "mongo连接失败");
  });

module.exports = {
  User: mongoose.model("User", require("./userModel")),
  Video: mongoose.model("Video", require("./videoModel")),
  Subscribe: mongoose.model("Subscribe", require("./subscribeModel")),
  VideoComment: mongoose.model("VideoComment", require("./videoCommentModel")),
  VideoLike: mongoose.model("VideoLike", require("./videoLikeModel")),
  collectModel: mongoose.model("CollectModel", require("./collectModel")),
};
