const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["litre", "kg", "pcs", "other"],
    },
    defaultPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
