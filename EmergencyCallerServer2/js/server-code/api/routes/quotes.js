const express = require("express");
const router = express.Router();

const QuotesController = require('../controllers/quotes');

// Handle incoming GET requests to /Items
router.get("/", QuotesController.get_random_quote);

module.exports = router;
