const express = require("express");
const router = express.Router();
const {
  createOrder,
  deleteOrder,
  getAllOrders,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.delete("/:id", deleteOrder);
router.get("/", getAllOrders);

module.exports = router;
