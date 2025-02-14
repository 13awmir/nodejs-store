const {
  CourseController,
} = require("../../http/controllers/admin/course.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");

const router = require("express").Router();

router.get("/list", CourseController.getListOfCourse);

router.get("/:id", CourseController.getCourseById);

router.post(
  "/add",
  uploadFile.single("image"),
  stringToArray("tags"),
  CourseController.addCourse
);
router.patch(
  "/update/:id",
  uploadFile.single("image"),
  CourseController.updateCourseById
);
// router.delete()
// router.patch()
// router.get()
// router.put() creat new chapter
// router.put() creat new episode

module.exports = {
  AdminApiCourseRouter: router,
};
