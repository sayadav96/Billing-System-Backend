const mongoose = require("mongoose");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const updateGlobalPrice = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { productId, priceIncrement } = req.body;

    await session.withTransaction(async () => {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $inc: { defaultPrice: priceIncrement },
        },
        { new: true, runValidators: true, session }
      );

      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      await Customer.updateMany(
        { "defaultProducts.product": productId },
        { $inc: { "defaultProducts.$.customPrice": priceIncrement } },
        { session }
      );
    });

    res.status(200).json({ message: "Global price updated successfully" });
  } catch (error) {
    console.error("Transaction failed", error);
    res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  } finally {
    await session.endSession();
  }
};

module.exports = { updateGlobalPrice };
