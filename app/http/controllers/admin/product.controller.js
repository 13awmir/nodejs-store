const createHttpError = require("http-errors");
const { ProductModel } = require("../../../models/products");
const {
  deleteFileInPublic,
  ListOfImagesFromRequest,
  setFeatures,
  copyObject,
} = require("../../../utils/functions");
const {
  createProductSchema,
} = require("../../validators/admin/product.schema");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { ObjectIdValidator } = require("../../validators/public.validator");
const Controller = require("../controller");
const path = require("path");
const product = require("../../../router/admin/product");

class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const images = ListOfImagesFromRequest(
        req?.files || [],
        req.body.fileUploadPath
      );
      const productBody = await createProductSchema.validateAsync(req.body);
      const {
        title,
        text,
        short_text,
        category,
        tags,
        count,
        price,
        discount,
        type,
      } = productBody;
      const supplier = req.user._id;

      let features = setFeatures(req.body);
      const product = await ProductModel.create({
        title,
        text,
        short_text,
        category,
        tags,
        count,
        price,
        discount,
        images,
        features,
        supplier,
        type,
      });
      return res.status(HttpStatus.CREATED).json({
        data: {
          stausCode: HttpStatus.CREATED,
          message: "ثبت محصول با موفقیت انجام شد",
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async editProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      const data = copyObject(req.body);
      data.images = ListOfImagesFromRequest(
        req?.files || [],
        req.body.fileUploadPath
      );
      data.features = setFeatures(req.body);
      let nulliShData = ["", " ", "0", 0, null, undefined];
      let blackListfields = [
        "bookmark",
        "like",
        "dislike",
        "comment",
        "supplier",
        "width",
        "lenght",
        "weight",
        "height",
        "colors",
      ];
      Object.keys(data).forEach((key) => {
        if (blackListfields.includes(key)) delete data[key];
        if (typeof data[key] == "string") data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key] > 0)
          data[key] = data[key].map((item) => item.trim());
        if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
        if (nulliShData.includes(data[key])) delete data[key];
      });
      const updateProduct = await ProductModel.updateOne(
        { _id: product._id },
        { $set: data }
      );
      if (updateProduct.modifiedCount == 0)
        throw createHttpError.InternalServerError("خطای داخلی");
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          message: "بروز رسانی با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      const removeProduct = await ProductModel.deleteOne({ _id: product._id });
      if (removeProduct.deletedCount == 0)
        throw createHttpError.InternalServerError("عملیات حذف انجام نشد");
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          message: "عملیات حذف با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req, res, next) {
    try {
      const search = req?.query?.search;
      let products;
      if (search) {
        products = await ProductModel.find({
          $text: {
            $search: search,
          },
        });
      } else {
        products = await ProductModel.find({});
      }
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          products,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getOneProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        product,
      });
    } catch (error) {
      next(error);
    }
  }
  async findProductById(productID) {
    const { id } = await ObjectIdValidator.validateAsync({ id: productID });
    const product = await ProductModel.findById(id);
    if (!product) throw createHttpError.NotFound("محصولی یافت نشد");
    return product;
  }
}
module.exports = {
  ProductController: new ProductController(),
};
