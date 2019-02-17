const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAuth_PP = require('../middleware/check-auth_pp');
const checkAuth_SLTFR = require('../middleware/check-auth_sltfr');

const CategoriesController = require('../controllers/categories');

// Handle incoming requests to /categories for RGE
router.get("/rge/", CategoriesController.categories_get_all);

router.post("/rge/", checkAuth, CategoriesController.categories_create_category);

router.patch("/rge/:categoryId", checkAuth, CategoriesController.categories_edit_category);

router.get("/rge/:categoryId", CategoriesController.categories_get_category);

router.delete("/rge/:categoryId", checkAuth, CategoriesController.categories_delete_category);


// Handle incoming requests to /categories for Phoenix
router.get("/pp/", CategoriesController.categories_get_all_pp);

router.post("/pp/", checkAuth_PP, CategoriesController.categories_create_category_pp);

router.patch("/pp/:categoryId", checkAuth_PP, CategoriesController.categories_edit_category_pp);

router.get("/pp/:categoryId", CategoriesController.categories_get_category_pp);

router.delete("/pp/:categoryId", checkAuth_PP, CategoriesController.categories_delete_category_pp);

module.exports = router;


// Handle incoming requests to /categories for Salutifer
router.get("/sltfr/", CategoriesController.categories_get_all_sltfr);

router.post("/sltfr/", checkAuth_SLTFR, CategoriesController.categories_create_category_sltfr);

router.patch("/sltfr/:categoryId", checkAuth_SLTFR, CategoriesController.categories_edit_category_sltfr);

router.get("/sltfr/:categoryId", CategoriesController.categories_get_category_sltfr);

router.delete("/sltfr/:categoryId", checkAuth_SLTFR, CategoriesController.categories_delete_category_sltfr);

module.exports = router;
