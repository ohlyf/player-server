// 热度
const { redis } = require("./index");

exports.hotsInc = async (videoId, incNum) => {
  const data = await redis.zscore("videoHots", videoId);
  if (data) {
    const inc = await redis.zincrby("videoHots", incNum.videoId);
  } else {
    const inc = await redis.zadd("videoHots", incNum.videoId);
  }
  return inc;
};

exports.topHots = async (num) => {
  const leaderBoard = await redis.zrevrange("videoHots", 0, -1, "withscores");
  const newArr = leaderBoard.slice(0, num * 2);
  const obj = {};
  for (let i = 0; i < newArr.length; i++) {
    if (i % 2 == 0) {
      obj[newArr[i]] = newArr[i + 1];
    }
  }
  return obj;
};
