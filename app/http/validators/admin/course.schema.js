const Joi = require("@hapi/joi");
const createError = require("http-errors");
const { MONGODBID } = require("../../../utils/constant");
const createCourseSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .error(createError.BadRequest("عنوان دوره صحیح نمیباشد")),
  text: Joi.string().error(
    createError.BadRequest("متن ارسال شده صحیح نمیباشد")
  ),
  short_text: Joi.string().error(
    createError.BadRequest("متن ارسال شده صحیح نمیباشد")
  ),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createError.BadRequest("برچسب ها نمیتواند بیشتر از 20 ایتم باشد")),
  category: Joi.string()
    .regex(MONGODBID)
    .error(createError.BadRequest("دسته بندی مورد نظر یافت نشد")),
  price: Joi.number().error(
    createError.BadRequest("قیمت وارد شده صحیح نمیباشد")
  ),
  discount: Joi.number().error(
    createError.BadRequest("تخفیف وارد شده صحیح نمیباشد")
  ),
  type: Joi.string().regex(/(free|cash|special)/i),
  filename: Joi.string()
    .regex(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/)
    .error(createError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
  fileUploadPath: Joi.allow(),
});

const createEpisodeSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .error(createError.BadRequest("عنوان دوره صحیح نمیباشد")),
  text: Joi.string().error(
    createError.BadRequest("متن ارسال شده صحیح نمیباشد")
  ),
  chapterID: Joi.string()
    .regex(MONGODBID)
    .error(createError.BadRequest("شناسه فصل صحیح نمیباشد")),
  courseID: Joi.string()
    .regex(MONGODBID)
    .error(createError.BadRequest("شناسه دوره صحیح نمیباشد")),
  type: Joi.string().regex(/(lock|unlock)/i),
  filename: Joi.string()
    .regex(/(\.mp4|\.mov|\.mkv|\.mpg|)$/)
    .error(createError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
  fileUploadPath: Joi.allow(),
});

module.exports = {
  createCourseSchema,
  createEpisodeSchema,
};
