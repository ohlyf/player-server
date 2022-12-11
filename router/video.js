const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");
const vodController = require("../controller/vodController");
const { verifyToken } = require("../utils/jwt");
const { videoValidator } = require("../middleware/validator/videoValidator");

router
  .get("/hots/:num", videoController.getHots)
  .get("/collect/:videoId", verifyToken(), videoController.collect)
  .get("/like", verifyToken(), videoController.likeList)
  .get("/dislike/:videoId", verifyToken(), videoController.disLikeVideo)
  .get("/like/:videoId", verifyToken(), videoController.likeVideo)
  .delete(
    "/comment/:videoId/:commentId",
    verifyToken(),
    videoController.deleteComment
  )
  .get("/comment/:videoId", videoController.commentList)
  .post("/comment/:videoId", verifyToken(), videoController.comment)
  .get("/video", videoController.videoList)
  .get("/video/:videoId", verifyToken(false), videoController.video)
  .get("/vod", verifyToken(), vodController.getVod)
  .post("/video", verifyToken(), videoValidator, videoController.createVideo);
module.exports = router;
