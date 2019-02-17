const express = require("express");
const router = express.Router();

const WhitelistsController = require('../controllers/whitelists');

// Handle incoming requests to /categories for RGE
router.get("/:phoneNo", WhitelistsController.get_whitelist);

//New Device registration.
router.post("/createDevice", WhitelistsController.create_device);

//Call trigger.
router.post("/callingTrigger", WhitelistsController.trigger_call);

module.exports = router;
