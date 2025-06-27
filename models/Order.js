const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
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
    bill: {
      type: Number,
      required: true,
    },
    oldBalance: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      required: true,
    },
    newBalance: {
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
