const Jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constant");
const createHttpError = require("http-errors");
const { UserModel } = require("../../models/users");
function VerifyAccessToken(req, res, next) {
  const headers = req.headers;
  const [bearer, token] = headers?.accesstoken?.split(" ") || [];
  if (token && ["Bearer", "bearer"].includes(bearer)) {    
    Jwt.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err)
        return next(createHttpError.Unauthorized("1وارد حساب کاربری خود شوید"));
      const { mobile } = payload || {};
      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
      if (!user)
        return next(createHttpError.Unauthorized("حساب کاربری یافت نشد"));
      req.user = user;
      return next();
    });
  }else return next(createHttpError.Unauthorized("2وارد حساب کاربری خود شوید"));
}

module.exports = {
  VerifyAccessToken,
};
