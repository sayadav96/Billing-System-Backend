//inventoryRoutes.js

const express = require("express");
const router = express.Router();
const {
  createInventory,
  updateInventory,
} = require("../controllers/inventoryController");

router.post("/", createInventory);
router.patch("/:id", updateInventory);

module.exports = router;
