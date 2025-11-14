const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("No Redis url");
}
const client = createClient({ url: redisUrl });

client.connect();

module.exports = client;
