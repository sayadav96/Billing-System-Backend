const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, unit, defaultPrice } = req.body;

    if (!name || !unit || defaultPrice == undefined) {
      return res
        .status(400)
        .json({ message: "Name, unit, and defaultPrice are all required" });
    }

    const newProduct = new Product({
      name,
      unit,
      defaultPrice,
    });
    await newProduct.save();

    return res.status(201).json({
      message: "New product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating Product", error);
    return res.status(500).json({ message: "server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "update successful", updated });
  } catch (error) {
    console.error("Error updating the product: ", error);
    res.status(500).json({ message: "Product update failed" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "id not found" });
    }

    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.error("Deleting product failed", error);
    res.status(500).json({ message: "Product deletion failed" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching the products" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
