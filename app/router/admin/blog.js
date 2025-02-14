const {
  AdminBlogController,
} = require("../../http/controllers/admin/blog.controller");
const { stringToArray } = require("../../http/middlewares/stringtoarray");
const { uploadFile } = require("../../utils/multer");

const router = require("express").Router();

router.get("/", AdminBlogController.getListOfBlog);

router.post(
  "/add",
  uploadFile.single("image"),
  stringToArray("tags"),
  AdminBlogController.creatBlog
);

router.get("/:id", AdminBlogController.getOneBlogById);

router.delete("/:id", AdminBlogController.deleteBlogById);

router.patch(
  "/update/:id",
  uploadFile.single("image"),
  stringToArray("tags"),
  AdminBlogController.updateBlogById
);
module.exports = {
  AdminApiBlogRouter: router,
};
