/**
 * 默认配置
 */

module.exports = {
  uuid: "A022921C-AB99-182A-74FC-779399FCED9B",
  mongo: {
    url: "mongodb://admin:abc123456@47.99.147.11:27017/player?authSource=admin",
  },
  redisClient: {
    path: "127.0.0.1",
    port: 6379,
    options: { password: "root" },
  },
};
