const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createHttpError = require("http-errors");
function creatRoute(req) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "blogs",
    year,
    month,
    day
  );
  req.body.fileUploadPath = path.join("uploads", "blogs", year, month, day).replace(/\\/g, "/");
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = creatRoute(req);
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = String(new Date().getTime() + ext);
    req.body.filename = fileName;
    cb(null, fileName);
  },
});
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimtypes = [".jpg", ".jpeg", ".png", ".webp"];
  if (mimtypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("فرمت تصویر ارسال شده صحیح نمیباشد"));
}
function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimtypes = [".mp4", ".mpg", ".avi", ".mkv"];
  if (mimtypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("فرمت ویدو ارسال شده صحیح نمیباشد"));
}
const maxSize = 1 * 1000 * 1000;
const maxVideoSize = 300 * 1000 * 1000;
const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});
const uploadVideo = multer({
  storage,
  videoFilter,
  limits: { fileSize: maxVideoSize },
});
module.exports = {
  uploadFile,
  uploadVideo,
};
