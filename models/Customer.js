const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String, // changed from Number for flexibility
      unique: true,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    defaultProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        customPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    outstandingAmount: {
      type: Number,
      default: 0,
    },
    lastPaidOn: {
      type: Date,
    },
    lastBilledOn: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Customer", customerSchema);
