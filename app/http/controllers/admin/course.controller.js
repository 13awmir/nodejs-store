const createHttpError = require("http-errors");
const { CourseModel } = require("../../../models/course");
const { createCourseSchema } = require("../../validators/admin/course.schema");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  deleteFileInPublic,
  copyObject,
  deleteInvalidPropertyInObject,
} = require("../../../utils/functions");
const path = require("path");
class CourseController extends Controller {
  async getListOfCourse(req, res, next) {
    try {
      const search = req?.query?.search;
      let courses;
      if (search) {
        courses = await CourseModel.find({
          $text: { $search: search },
        }).populate([
          ({ path: "category", select: { children: 0, parent: 0 } },
          {
            path: "teacher",
            select: { first_name: 1, last_name: 1, mobile: 1, email: 1 },
          }),
        ]);
      } else {
        courses = await CourseModel.find({})
          .populate([
            ({ path: "category", select: { children: 0, parent: 0 } },
            {
              path: "teacher",
              select: { first_name: 1, last_name: 1, mobile: 1, email: 1 },
            }),
          ])
          .sort({ _id: -1 });
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          courses,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async addCourse(req, res, next) {
    try {
      await createCourseSchema.validateAsync(req.body);
      const { fileUploadPath, filename } = req.body;
      const teacher = req.user._id;
      const image = path.join(fileUploadPath, filename).replace(/\\/g, "/");
      req.body.image = image;
      const { title, short_text, text, tags, category, price, discount, type } =
        req.body;
      if (Number(price) > 0 && type === "free")
        throw createHttpError.BadRequest("لرای دوره رایگان نمیتوان قیمت گذاشت");
      const course = await CourseModel.create({
        title,
        short_text,
        text,
        tags,
        category,
        price,
        type,
        discount,
        teacher,
        image,
        status: "notStarted",
      });
      if (!course?._id)
        throw createHttpError.InternalServerError("دوره ایجاد نشد");
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "دوره با موفقیت ایجاد شد",
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      if (!course) throw createHttpError.NotFound("دوره ای یافت نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          course,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await this.findCourseById(id);
      const data = copyObject(req.body);
      const { filename, fileUploadPath } = req.body;
      let blackListFields = [
        "time",
        "chapters",
        "episodes",
        "students",
        "bookmarks",
        "dislikes",
        "likes",
        "comments",
        "fileUploadPath",
        "filename",
      ];
      deleteInvalidPropertyInObject(data, blackListFields);
      if (req.file) {
        data.image = path.join(fileUploadPath, filename);
        deleteFileInPublic(course.image);
      }
      const updateCourseResult = await CourseModel.updateOne(
        { _id: id },
        {
          $set: data,
        }
      );
      if (!updateCourseResult.modifiedCount)
        throw new createHttpError.InternalServerError("به روزرسانی انجام نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "به روزرسانی دوره اانجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async findCourseById(id) {
    const course = await CourseModel.findById(id);
    if (!course) throw createHttpError.NotFound("دوره ای یافت نشد");
    return course;
  }
}

module.exports = {
  CourseController: new CourseController(),
};
