const redisDB = require("redis");
const redisClient = redisDB.createClient();
redisClient.connect();
redisClient.on("connect", () => console.log("connected to redis"));
redisClient.on("ready", () => console.log("redis is ready to use..."));
redisClient.on("error", (err) => console.log("RedisError : ", err.message));
redisClient.on("end", () => console.log("redis is disconnected"));

module.exports = redisClient;
