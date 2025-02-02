const Joi = require("@hapi/joi");
const { MONGODBID } = require("../../utils/constant");
const createHttpError = require("http-errors");

const ObjectIdValidator = Joi.object({
  id: Joi.string()
    .pattern(MONGODBID)
    .error(createHttpError.BadRequest("شناسه وارد شده اشتباه است")),
});

module.exports = {
  ObjectIdValidator,
};
