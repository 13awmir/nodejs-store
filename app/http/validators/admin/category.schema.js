const Joi = require("@hapi/joi");
const { MONGODBID } = require("../../../utils/constant");
const addCategorySchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .error(new Error("نام وارد شده صحیح نمیباشد")),
  parent: Joi.string()
    .allow("")
    .pattern(MONGODBID)
    .error(new Error("والد انتخاب شده صحیح نمیباشد")),
});
module.exports = {
  addCategorySchema,
};
