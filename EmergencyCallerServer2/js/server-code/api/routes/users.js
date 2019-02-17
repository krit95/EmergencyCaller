const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAuth_PP = require('../middleware/check-auth_pp');
const checkAuth_SLTFR = require('../middleware/check-auth_sltfr');

const UsersController = require('../controllers/users');

//user sign in handler for RGE
router.post("/rge/signin", UsersController.user_sign_in);

router.post("/rge/signout", checkAuth, UsersController.user_sign_out);

//user sign in handler for PP
router.post("/pp/signin", UsersController.user_sign_in_pp);

router.post("/pp/signout", checkAuth_PP, UsersController.user_sign_out_pp);

module.exports = router;

//user sign in handler for SLTFR
router.post("/sltfr/signin", UsersController.user_sign_in_sltfr);

router.post("/sltfr/signout", checkAuth_SLTFR, UsersController.user_sign_out_sltfr);

module.exports = router;
