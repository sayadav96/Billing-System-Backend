const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now, // Automatically sets the date when an order is created
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        rateAtPurchase: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    outstandingAtTime: {
      type: Number,
      required: true,
    },
    billedBy: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isReturn: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
