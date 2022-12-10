const RPCClient = require("@alicloud/pop-core").RPCClient;

const initVodClient = (accessKeyId, accessKeySecret) => {
  const regionId = "cn-shanghai"; // 点播服务接入地域
  const client = new RPCClient({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: "http://vod." + regionId + ".aliyuncs.com",
    apiVersion: "2017-03-21",
  });

  return client;
};

const getVod = async (req, res) => {
  // 请求示例
  const client = initVodClient("accessKeyId", "accessKeySecret");

  const vodBack = await client.request(
    "CreateUploadVideo",
    {
      Title: "this is a sample",
      FileName: "filename.mp4",
    },
    {}
  );
  res.status(200).json({ vod: vodBack });
};

module.exports = {
  getVod,
};
