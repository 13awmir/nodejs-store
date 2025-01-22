const {
  CategoryController,
} = require("../../http/controllers/admin/category.controller");

const router = require("express").Router();
/**
 * @swagger
 *  /admin/category/add:
 *      post:
 *          tags: [Admin-Panel]
 *          summery: creat new category
 *          parameters:
 *              -   in: formData
 *                  type: string
 *                  required: true
 *                  name: title
 *              -   in: formData
 *                  type: string
 *                  required: false
 *                  name: parent
 *          responses:
 *              201:
 *                  description : success
 */
router.post("/add", CategoryController.addCategory);
router.get("/parents", CategoryController.getAllParents);
/**
 * @swagger
 *  /admin/category/parents:
 *      get:
 *          tags: [Admin-Panel]
 *          summery: get all parents of Category
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/children/:parent", CategoryController.getchildOfParents);
/**
 * @swagger
 *  /admin/category/children/{parent}:
 *      get:
 *          tags: [Admin-Panel]
 *          summery: get all children of Category
 *          parameters:
 *              -   in: path
 *                  name: parent
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/all", CategoryController.getAllCategory);
/**
 * @swagger
 *  /admin/category/all:
 *      get:
 *          tags: [Admin-Panel]
 *          summery: get all categories
 *          responses:
 *              200:
 *                  description: success
 */
router.delete("/remove/:id", CategoryController.removeCategory);
/**
 * @swagger
 *  /admin/category/remove/{id}:
 *      delete:
 *          tags: [Admin-Panel]
 *          summery: remove category by id
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
module.exports = {
  CategoryRoutes: router,
};
