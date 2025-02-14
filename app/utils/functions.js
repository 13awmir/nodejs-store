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
const path = require("path");
const fs = require("fs");
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
      expiresIn: "1y",
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
function deleteFileInPublic(fileAddress) {
  if (fileAddress) {
    const pathFile = path.join(__dirname, "..", "..", "public", fileAddress);
    if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
  }
}
function ListOfImagesFromRequest(files, fileUploadPath) {
  if (files?.length > 0) {
    return files
      .map((file) => path.join(fileUploadPath, file.filename))
      .map((item) => item.replace(/\\/g, "/"));
  } else {
    return [];
  }
}
function setFeatures(body) {
  const { colors, width, weight, height, length } = body;
  let features = {};
  features.colors = colors;
  if (!isNaN(+width) || !isNaN(+height) || !isNaN(+weight) || !isNaN(+length)) {
    if (!width) features.width = 0;
    else features.width = +width;
    if (!height) features.height = 0;
    else features.height = +height;
    if (!weight) features.weight = 0;
    else features.weight = +weight;
    if (!length) features.length = 0;
    else features.length = +length;
  }
  return features;
}
function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nulliShData = ["", " ", 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key] > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nulliShData.includes(data[key])) delete data[key];
  });
}
function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}
function getTime(time) {
  let total = Math.round(time) / 60;
  let [min, percentage] = String(total).split(".");
  if (percentage == undefined) percentage = "0";
  let sec = Math.round((percentage.substring(0, 2) * 60) / 100);
  let hour = 0;
  if (min > 59) {
    total = min / 60;
    [hour, percentage] = String(total).split(".");
    if (percentage == undefined) percentage = "0";
    min = Math.round((percentage.substring(0, 2) * 60) / 100);
  }
  if (hour < 10) hour = `0${hour}`;
  if (min < 10) min = `0${min}`;
  if (sec < 10) sec = `0${sec}`;
  return hour + ":" + min + ":" + sec;
}
function getTimeOfCourse(chapters = []) {
  let time,
    hour,
    minute,
    second = 0;
  for (const chapter of chapters) {
    if (Array.isArray(chapter?.episodes)) {
      for (const episode of chapter.episodes) {
        if (episode?.time)
          time = episode.time.split(":"); // [hour, min, second]
        else time = "00:00:00".split(":");
        if (time.length == 3) {
          second += Number(time[0]) * 3600; // convert hour to second
          second += Number(time[1]) * 60; // convert minute to second
          second += Number(time[2]); //sum second with seond
        } else if (time.length == 2) {
          //05:23
          second += Number(time[0]) * 60; // convert minute to second
          second += Number(time[1]); //sum second with seond
        }
      }
    }
  }
  hour = Math.floor(second / 3600); //convert second to hour
  minute = Math.floor(second / 60) % 60; //convert second to mintutes
  second = Math.floor(second % 60); //convert seconds to second
  if (String(hour).length == 1) hour = `0${hour}`;
  if (String(minute).length == 1) minute = `0${minute}`;
  if (String(second).length == 1) second = `0${second}`;
  return hour + ":" + minute + ":" + second;
}

module.exports = {
  randomNumberGenerator,
  SignAccessToken,
  SignRefreshToken,
  VerifyRefreshToken,
  existCategory,
  deleteFileInPublic,
  ListOfImagesFromRequest,
  setFeatures,
  copyObject,
  deleteInvalidPropertyInObject,
  getTime,
  getTimeOfCourse,
};
