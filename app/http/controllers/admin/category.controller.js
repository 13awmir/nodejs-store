const createHttpError = require("http-errors");
const { CategryModel } = require("../../../models/categories");
const Controller = require("../controller");
const {
  addCategorySchema,
  updateCategorySchema,
} = require("../../validators/admin/category.schema");
const { existCategory } = require("../../../utils/functions");
const mongoose = require("mongoose");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class CategoryController extends Controller {
  async addCategory(req, res, next) {
    try {
      await addCategorySchema.validateAsync(req.body);
      const { title, parent } = req.body;
      await existCategory(title);
      const category = await CategryModel.create({ title, parent });
      if (!category) throw createHttpError.InternalServerError("خطای داخلی");
      return res.status(HttpStatus.CREATED).json({
        data: {
          statusCode: HttpStatus.CREATED,
          message: "دسته بندی افزوده شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this.checkExistCategory(id);
      const deleteResult = await CategryModel.deleteMany({
        $or: [{ _id: category._id }, { parent: category._id }],
      });
      if (deleteResult.deletedCount == 0)
        throw createHttpError.InternalServerError("عملیات حذف انجام نشد");
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          message: "دسته بندی با موفقیت حذف شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async editCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const category = await this.checkExistCategory(id);
      await updateCategorySchema.validateAsync(req.body);
      const update = await CategryModel.updateOne({ _id: id }, { $set: {title} });
      if (update.modifiedCount == 0)
        throw createHttpError.InternalServerError("بروز رسانی انجام نشد");
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          message: "بروز رسانی انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategory(req, res, next) {
    try {
      // const category = await CategryModel.aggregate([
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "_id",
      //       foreignField: "parent",
      //       as: "children",
      //     },
      //   },
      //   {
      //     $project: {
      //       __v: 0,
      //       "children.__v": 0,
      //       "children.parent": 0,
      //     },
      //   },
      //   {
      //     $match: {
      //       parent: undefined,
      //     },
      //   },
      // ]);
      // const category = await CategryModel.aggregate([
      //   {
      //     $graphLookup: {
      //       from: "categories",
      //       startWith: "$_id",
      //       connectFromField: "_id",
      //       connectToField: "parent",
      //       maxDepth: 5,
      //       depthField: "depth",
      //       as: "children",
      //     },
      //   },
      //   {
      //     $project: {
      //       __v: 0,
      //       "children.__v": 0,
      //       "children.parent": 0,
      //     },
      //   },
      //   {
      //     $match: {
      //       parent: undefined,
      //     },
      //   },
      // ]);
      // return res.status(HttpStatus.OK).json({
      //   data: {
      //     category,
      //   },
      // });
      const categories = await CategryModel.find(
        { parent: undefined },
        { __v: 0 }
      );
      return res.status(HttpStatus.OK).json({
        data: {
          categories,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategryModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "children",
          },
        },
        {
          $project: {
            __v: 0,
            "children.__v": 0,
            "children.parent": 0,
          },
        },
      ]);
      return res.status(HttpStatus.OK).json({
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllParents(req, res, next) {
    try {
      const parents = await CategryModel.find(
        { parent: undefined },
        { __v: 0 }
      );
      return res.status(HttpStatus.OK).json({
        data: {
          parents,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getchildOfParents(req, res, next) {
    try {
      const { parent } = req.params;
      const children = await CategryModel.find({ parent }, { __v: 0 });
      return res.status(HttpStatus.OK).json({
        data: {
          children,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategoryWithouotPopulate(req, res, next) {
    try {
      const categories = await CategryModel.aggregate([
        { $match: {} },
        { $project: { __v: 0 } },
      ]);
      return res.status(HttpStatus.OK).json({
        data: {
          categories,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async checkExistCategory(id) {
    const category = await CategryModel.findById(id);
    if (!category)
      throw createHttpError.NotFound("دسته بندی مورد نظر یافت نشد");
    return category;
  }
}

module.exports = {
  CategoryController: new CategoryController(),
};
