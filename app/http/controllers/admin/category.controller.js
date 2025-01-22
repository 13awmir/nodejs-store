const createHttpError = require("http-errors");
const { CategryModel } = require("../../../models/categories");
const Controller = require("../controller");
const { addCategorySchema } = require("../../validators/admin/category.schema");
const { existCategory } = require("../../../utils/functions");

class CategoryController extends Controller {
  async addCategory(req, res, next) {
    try {
      await addCategorySchema.validateAsync(req.body);
      const { title, parent } = req.body;
      await existCategory(title);
      const category = await CategryModel.create({ title, parent });
      if (!category) throw createHttpError.InternalServerError("خطای داخلی");
      return res.status(201).json({
        data: {
          statusCode: 201,
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
      const deleteResult = await CategryModel.deleteOne({ _id: category._id });
      if (deleteResult.deletedCount == 0)
        throw createHttpError.InternalServerError("عملیات حذف انجام نشد");
      return res.status(200).json({
        data: {
          statusCode: 200,
          message: "دسته بندی با موفقیت حذف شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  editCategory(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async getAllCategory(req, res, next) {
    try {
      const category = await CategryModel.aggregate([
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
        {
          $match: {
            parent: undefined,
          },
        },
      ]);
      return res.status(200).json({
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  getCategoryById(req, res, next) {
    try {
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
      return res.status(200).json({
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
      return res.status(200).json({
        data: {
          children,
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
