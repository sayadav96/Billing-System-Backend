const {
  createCustomer,
  updateCustomer,
  getAllCustomers,
} = require("../controllers/customerController");
const express = require("express");
const router = express.Router();

router.get("/", getAllCustomers);
router.post("/", createCustomer);
router.patch("/:id", updateCustomer);

module.exports = router;
