const createHttpError = require("http-errors");
const { BlogModel } = require("../../../models/blogs");
const { deleteFileInPublic } = require("../../../utils/functions");
const { creatBlogSchema } = require("../../validators/admin/blog.schema");
const Controller = require("./../controller");
const path = require("path");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class BlogController extends Controller {
  async creatBlog(req, res, next) {
    try {
      const blogDataBody = await creatBlogSchema.validateAsync(req.body);
      req.body.image = path.join(
        blogDataBody.fileUploadPath,
        blogDataBody.filename
      );
      req.body.image = req.body.image.replace(/\\/g, "/");
      const { title, text, short_text, category, tags } = blogDataBody;
      const image = req.body.image;
      const author = req.user._id;
      const blog = await BlogModel.create({
        title,
        text,
        short_text,
        image,
        category,
        tags,
        author,
      });
      return res.status(HttpStatus.CREATED).json({
        data: {
          statusCode: HttpStatus.CREATED,
          message: "ایجاد بلاگ با موفقیت انجام شد",
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async getOneBlogById(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await this.findeBlog({ _id: id });
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          blog,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getListOfBlog(req, res, next) {
    try {
      const blogs = await BlogModel.aggregate([
        { $match: {} },
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "author",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $lookup: {
            from: "categories",
            foreignField: "_id",
            localField: "category",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $project: {
            "author.__v": 0,
            "category.__v": 0,
            "author.otp": 0,
            "author.roles": 0,
            "author.bills": 0,
            "author.discount": 0,
          },
        },
      ]);
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          blogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getCommentOfBlog(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async deleteBlogById(req, res, next) {
    try {
      const { id } = req.params;
      await this.findeBlog({ _id: id });
      const deleteblog = await BlogModel.deleteOne({ _id: id });
      if (deleteblog.deletedCount == 0)
        throw createHttpError.InternalServerError("حذف مقاله انجام نشد");
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          message: "حذف مقاله با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBlogById(req, res, next) {
    try {
      const { id } = req.params;
      await this.findeBlog({ _id: id });
      if (req?.body?.fileUploadPath && req?.body?.filename) {
        req.body.image = path.join(
          blogDataBody.fileUploadPath,
          blogDataBody.filename
        );
        req.body.image = req.body.image.replace(/\\/g, "/");
      }
      const data = req.body;
      let nulliShData = ["", " ", "0", 0, null, undefined];
      let blackListfields = [
        "bookmark",
        "like",
        "dislike",
        "comment",
        "author",
      ];
      Object.keys(data).forEach((key) => {
        if (blackListfields.includes(key)) delete data[key];
        if (typeof data[key] == "string") data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key] > 0)
          data[key] = data[key].map((item) => item.trim());
        if (nulliShData.includes(data[key])) delete data[key];
      });
      const updateBlog = await BlogModel.updateOne({ _id: id }, { $set: data });
      if (updateBlog.modifiedCount == 0)
        throw createHttpError.InternalServerError("بروز رسانی انجام نشد");
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          message: "بروزرسانی انجام شد",
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async findeBlog(query = {}) {
    const blog = await BlogModel.findOne(query).populate([
      { path: "category" },
      { path: "author" },
    ]);
    if (!blog) throw createHttpError.NotFound("مقاله ای یافت نشد");
    return blog;
  }
}

module.exports = {
  AdminBlogController: new BlogController(),
};
