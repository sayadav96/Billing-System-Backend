const express = require("express");
const { updateGlobalPrice } = require("../controllers/updatePriceController");
const router = express.Router();

router.post("/", updateGlobalPrice);

module.exports = router;
