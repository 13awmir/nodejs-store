const redisClient = require("../utils/init_redis");
const { AdminRoutes } = require("./admin/admin.routes");
const { HomeRoutes } = require("./api");
const { DeveloperRoutes } = require("./developer.routes");
const { UserAuthRoutes } = require("./user/auth");
const router = require("express").Router();
(async () => {
  await redisClient.set("key", "value");
  const value = await redisClient.get("key");
  console.log(value);
})();
router.use("/", HomeRoutes);
router.use("/developer", DeveloperRoutes);
router.use("/admin", AdminRoutes);
router.use("/user", UserAuthRoutes);
module.exports = {
  Allroutes: router,
};
