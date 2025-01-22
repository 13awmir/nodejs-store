const {
  UserAuthController,
} = require("../../http/controllers/user/auth/auth.controller");
const router = require("express").Router();
/**
 * @swagger
 * tags:
 *  name: User-Authentication
 *  description : user-auth section
 */

/**
 * @swagger
 *  /user/send-otp:
 *      post:
 *          tags: [User-Authentication]
 *          summary: login user in userpanel with phone number
 *          description: one time password (OTP) login
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phonenumber
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorization
 *              500:
 *                  description: internal Server Error
 */
/**
 * @swagger
 *  /user/check-otp:
 *      post:
 *          tags: [User-Authentication]
 *          summary: check-otp code
 *          description: check one time password (OTP)
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phonenumber
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: code
 *              description: enter otp code
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorization
 *              500:
 *                  description: internal Server Error
 */
/**
 * @swagger
 *  /user/refresh-token:
 *      post:
 *          tags: [User-Authentication]
 *          summary: login user in userpanel with phone number
 *          description: one time password (OTP) login
 *          parameters:
 *          -   in: formData
 *              name: refreshToken
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Success
 */
router.post("/send-otp", UserAuthController.getOtp);
router.post("/check-otp", UserAuthController.checkOtp);
router.post("/refresh-token", UserAuthController.refreshToken);
module.exports = {
  UserAuthRoutes: router,
};
