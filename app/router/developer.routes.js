const router = require("express").Router();
const bcrypt = require("bcrypt");
const { randomNumberGenerator } = require("../utils/functions");
/**
 * @swagger
 *  tags:
 *      name : Developer-Routes
 *      description: developer utils
 */

/**
 * @swagger
 *  /developer/password-hash/{password}:
 *      get:
 *          tags: [Developer-Routes]
 *          summery: hash data with bcrypt
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  name: password
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/password-hash/:password", (req, res, next) => {
  const { password } = req.params;
  const salt = bcrypt.genSaltSync(10);
  return res.send(bcrypt.hashSync(password, salt));
});
/**
 * @swagger
 *  /developer/random-number:
 *      get:
 *          tags: [Developer-Routes]
 *          summery: hash data with bcrypt
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/random-number", (req, res, next) => {
  return res.send(randomNumberGenerator().toString());
});
module.exports = {
  DeveloperRoutes: router,
};
