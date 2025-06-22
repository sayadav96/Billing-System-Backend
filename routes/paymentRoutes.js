const express = require("express");
const router = express.Router();

const {
  createPayment,
  deletePayment,
  getAllPayments,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.delete("/:id", deletePayment);
router.get("/", getAllPayments);

module.exports = router;
