const router = require("express").Router();
const categoryController = require("./../Controller/categoryController");
// register
router.get("/allCategories", categoryController.getAllCategories);
router.get("/allCategoriesData", categoryController.getAllCategoriesData);
module.exports = router;
