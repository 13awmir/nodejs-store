const {
  VerifyAccessToken,
} = require("../../http/middlewares/verifyAccessToken");
const { AdminApiBlogRouter } = require("./blog");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiProductRouter } = require("./product");
/**
 * @swagger
 *  tags:
 *      -   name : Admin-Panel
 *          description : action of admin (add , remove , edit ....)
 *      -   name: Product(AdminPanel)
 *          description: management product route
 *      -   name : Category(AdminPanel)
 *          description : all methods and routes of category section
 *      -   name : Blog(AdminPanel)
 *          description : make blog and manage admin panel
 */
const router = require("express").Router();
router.use("/category", AdminApiCategoryRouter);
router.use("/blogs", AdminApiBlogRouter);
router.use("/products", AdminApiProductRouter);
module.exports = {
  AdminRoutes: router,
};
