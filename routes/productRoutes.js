//productRoutes.js

const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
