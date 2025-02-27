const {
  CategoryController,
} = require("../../http/controllers/admin/category.controller");

const router = require("express").Router();


router.post("/add", CategoryController.addCategory);
router.get("/parents", CategoryController.getAllParents);

router.get("/children/:parent", CategoryController.getchildOfParents);

router.get("/all", CategoryController.getAllCategory);

router.delete("/remove/:id", CategoryController.removeCategory);

router.get("/list-of-all", CategoryController.getAllCategoryWithouotPopulate);

router.get("/:id", CategoryController.getCategoryById);

router.patch("/update/:id", CategoryController.editCategory);


module.exports = {
  AdminApiCategoryRouter: router,
};
