const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAuth_PP = require('../middleware/check-auth_pp');
const checkAuth_SLTFR = require('../middleware/check-auth_sltfr');

const ItemsController = require('../controllers/items');

// Handle incoming requests to /Items for RGE
router.get("/rge/", ItemsController.items_get_all);

router.post("/rge/", checkAuth, ItemsController.items_create_item);

router.patch("/rge/:itemId", checkAuth, ItemsController.items_edit_item);

router.get("/rge/:itemId", ItemsController.items_get_item);

router.delete("/rge/:itemId", checkAuth, ItemsController.items_delete_item);


// Handle incoming requests to /Items for Phoenix
router.get("/pp/", ItemsController.items_get_all_pp);

router.post("/pp/", checkAuth_PP, ItemsController.items_create_item_pp);

router.patch("/pp/:itemId", checkAuth_PP, ItemsController.items_edit_item_pp);

router.get("/pp/:itemId", ItemsController.items_get_item_pp);

router.delete("/pp/:itemId", checkAuth_PP, ItemsController.items_delete_item_pp);

module.exports = router;


// Handle incoming requests to /Items for Salutifer
router.get("/sltfr/", ItemsController.items_get_all_sltfr);

router.post("/sltfr/", checkAuth_SLTFR, ItemsController.items_create_item_sltfr);

router.patch("/sltfr/:itemId", checkAuth_SLTFR, ItemsController.items_edit_item_sltfr);

router.get("/sltfr/:itemId", ItemsController.items_get_item_sltfr);

router.delete("/sltfr/:itemId", checkAuth_SLTFR, ItemsController.items_delete_item_sltfr);

module.exports = router;
