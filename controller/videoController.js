const {
  Video,
  VideoComment,
  VideoLike,
  Subscribe,
  collectModel,
} = require("../model/index");
const { hotsInc, topHots } = require("../model/redis/redisHotsInc");

exports.getHots = async (req, res) => {
  var topNum = req.params.topNum;
  var tops = await topHots(topNum);
  res.status(200).json({ tops });
};

// 观看+1 点赞+2 评论+2  收藏+3

exports.collect = async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.user.userinfo._id;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ err: "视频不存在" });
  }
  var doc = await collectModel.findOne({
    user: userId,
    video: videoId,
  });
  if (doc) {
    return res.status(403).json({ err: "视频以被收藏" });
  }
  const myCollect = await collectModel({
    user: userId,
    video: videoId,
  }).save();

  if (myCollect) {
    await hotsInc(videoId, 3);
  }
  res.status(201).json({ myCollect });
};

exports.likeList = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.body;
  var likes = await VideoLike.find({
    like: 1,
    user: req.user.userinfo._id,
  })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .populate("video", "_id title vodVideoId user");

  var likeCount = await VideoLike.countDocuments({
    like: 1,
    user: req.user.userinfo._id,
  });
  res.status(200).json({ likes, likeCount });
};

exports.disLikeVideo = async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.user.userinfo._id;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ err: "视频不存在" });
  }
  var doc = await VideoLike.findOne({
    user: userId,
    video: videoId,
  });

  let isDislike = true;

  if (doc && doc.like === -1) {
    await doc.remove();
  } else if (doc && doc.like === 1) {
    doc.like = -1;
    await doc.save();
    isDislike = false;
  } else {
    await new VideoLike({
      user: userId,
      video: videoId,
      like: -1,
    }).save();
    isDislike = false;
  }

  video.likeCount = await VideoLike.countDocuments({
    video: videoId,
    like: 1,
  });

  video.dislikeCount = await VideoLike.countDocuments({
    video: videoId,
    like: -1,
  });

  await video.save();
  res.status(200).json({
    ...video.toJSON(),
    isDislike,
  });
};

exports.likeVideo = async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.user.userinfo._id;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ err: "视频不存在" });
  }
  var doc = await VideoLike.findOne({
    user: userId,
    video: videoId,
  });

  let isLike = true;

  if (doc && doc.like === 1) {
    await doc.remove();
    isLike = false;
  } else if (doc && doc.like === -1) {
    doc.like = 1;
    await doc.save();
    await hotsInc(videoId, 2);
  } else {
    await new VideoLike({
      user: userId,
      video: videoId,
      like: 1,
    }).save();
    await hotsInc(videoId, 2);
  }

  video.likeCount = await VideoLike.countDocuments({
    video: videoId,
    like: 1,
  });

  video.dislikeCount = await VideoLike.countDocuments({
    video: videoId,
    like: -1,
  });

  await video.save();
  res.status(200).json({
    ...video.toJSON(),
    isLike,
  });
};

exports.deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params;
  const videoInfo = await Video.findById(videoId);
  if (!videoInfo) {
    return res.status(404).json({ err: "视频不存在" });
  }
  const comment = await VideoComment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ err: "评论不存在" });
  }
  if (!comment.user.equals(req.user.userinfo._id)) {
    return res.status(403).json({ err: "评论不可删除" });
  }
  await comment.remove();
  videoInfo.commentCount--;
  await videoInfo.save();
  res.status(200).json({ err: "删除成功" });
};

exports.commentList = async (req, res) => {
  const videoId = req.params.videoId;
  const { pageNum = 1, pageSize = 10 } = req.body;
  const comments = await VideoComment.find({ video: videoId })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .populate("user", "_id username avatar");
  const commentCount = await VideoComment.countDocuments({ video: videoId });
  res.status(200).json({ comments, commentCount });
};
exports.comment = async (req, res) => {
  const { videoId } = req.params;
  const videoInfo = await Video.findById(videoId);
  if (!videoInfo) {
    return res.status(404).json({ err: "视频不存在" });
  }
  const comment = await new VideoComment({
    content: req.body.content,
    video: videoId,
    user: req.user.userinfo._id,
  }).save();
  await hotsInc(videoId, 2);
  videoInfo.commentCount++;
  await videoInfo.save();
  res.status(201).json(comment);
};

exports.videoList = async (req, res) => {
  let { pageNum = 1, pageSize = 10 } = req.body;

  var videoList = await Video.find()
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ createAt: -1 })
    .populate("user", "_id username cover");
  const getVideoCount = await Video.countDocuments();

  res.status(200).json({ videoList, getVideoCount });
};

exports.video = async (req, res) => {
  const { videoId } = req.params;
  var videoInfo = await Video.findById(videoId).populate(
    "user",
    "_id username cover"
  );
  videoInfo = videoInfo.toJSON();
  videoInfo.isLike = false;
  videoInfo.isDislike = false;
  videoInfo.isSubscribe = false;

  if (req.user.userinfo) {
    const userId = req.user.userinfo._id;
    if (await VideoLike.findOne({ user: userId, video: videoId, like: 1 })) {
      videoInfo.isLike = true;
    }
    if (await VideoLike.findOne({ user: userId, video: videoId, like: -1 })) {
      videoInfo.isDislike = true;
    }
    if (
      await Subscribe.findOne({ user: userId, channel: videoInfo.user._id })
    ) {
      videoInfo.isSubscribe = true;
    }
  }
  await hotsInc(videoId, 1);
  res.status(200).json(videoInfo);
};

exports.createVideo = async (req, res) => {
  var body = req.body;
  body.user = req.user.userinfo._id;

  const videoModel = new Video(body);
  try {
    var dbBack = await videoModel.save();
    res.status(201).json({ dbBack });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};
