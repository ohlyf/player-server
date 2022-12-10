const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");
const vodController = require("../controller/vodController");
const { verifyToken } = require("../utils/jwt");
const { videoValidator } = require("../middleware/validator/videoValidator");

router
  .get("/collect/:videoId", verifyToken(), videoController.collect)
  .get("/likelist", verifyToken(), videoController.likelist)
  .get("/dislike/:videoId", verifyToken(), videoController.dislikevideo)
  .get("/like/:videoId", verifyToken(), videoController.likevideo)
  .delete(
    "/comment/:videoId/:commentId",
    verifyToken(),
    videoController.deletecomment
  )
  .get("/commentlist/:videoId", videoController.commentlist)
  .post("/comment/:videoId", verifyToken(), videoController.comment)
  .get("/videolist", videoController.videolist)
  .get("/video/:videoId", verifyToken(false), videoController.video)
  .get("/getvod", verifyToken(), vodController.getVod)
  .post(
    "/createvideo",
    verifyToken(),
    videoValidator,
    videoController.createvideo
  );
module.exports = router;
