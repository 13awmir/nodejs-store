const { randomInt } = require("crypto");
const { UserModel } = require("../models/users");
const Jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} = require("./constant");
const createHttpError = require("http-errors");
const redisClient = require("./init_redis");
const { CategryModel } = require("../models/categories");
function randomNumberGenerator() {
  return randomInt(10000, 99999);
}
function SignAccessToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId);
    const payload = {
      mobile: user.mobile,
    };
    const options = {
      expiresIn: "1h",
    };
    Jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(createHttpError.InternalServerError("خطای سرور داخلی"));
      resolve(token);
    });
  });
}
function SignRefreshToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId);
    const payload = {
      mobile: user.mobile,
    };
    const options = {
      expiresIn: "1y",
    };
    Jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, async (err, token) => {
      if (err) reject(createHttpError.InternalServerError("خطای سرور داخلی"));
      await redisClient.SETEX(String(userId), 365 * 24 * 60 * 60, token);
      resolve(token);
    });
  });
}
function VerifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    Jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err)
        reject(createHttpError.Unauthorized("1وارد حساب کاربری خود شوید"));
      const { mobile } = payload || {};
      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
      if (!user) reject(createHttpError.Unauthorized("حساب کاربری یافت نشد"));
      const refreshToken = await redisClient.get(user._id.toString());
      if (token === refreshToken) return resolve(mobile);
      reject(createHttpError.Unauthorized("ورود مجدد ناموفق بود"));
    });
  });
}
async function existCategory(title) {
  const category = await CategryModel.findOne({ title });
  if (category) throw createHttpError.BadRequest("کتگوری با این نام وجود دارد");
  return null;
}

module.exports = {
  randomNumberGenerator,
  SignAccessToken,
  SignRefreshToken,
  VerifyRefreshToken,
  existCategory,
};
