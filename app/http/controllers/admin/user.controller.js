const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/users");
const { deleteInvalidPropertyInObject } = require("../../../utils/functions");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class UserController extends Controller {
  async getAllUsers(req, res, next) {
    try {
      const { search } = req.query;
      const databaseQuery = {};
      if (search) databaseQuery["$text"] = { $search: search };
      const users = await UserModel.find(databaseQuery);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateUserProfile(req, res, next) {
    try {
      const userID = req.user._id;
      const data = req.body;
      const blackListFields = ["mobile", "otp", "discount", "roles", "courses"];
      deleteInvalidPropertyInObject(data, blackListFields);
      const profileUpdateResult = await UserModel.updateOne(
        { _id: userID },
        { $set: data }
      );
      if (!profileUpdateResult.modifiedCount)
        throw new createHttpError.InternalServerError("پروفایل بروزرسانی نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "پروفایل با موفقیت بروزرسانی شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  UserController: new UserController(),
};
