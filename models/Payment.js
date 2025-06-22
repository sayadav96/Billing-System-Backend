const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    modeOfPayment: {
      type: String,
      enum: [
        "cash",
        "online",
        "cheque",
        "cash + online",
        "cash + cheque",
        "cheque + online",
      ],
      default: "cash",
    },
    paidTo: {
      type: String,
      trim: true,
      lowercase: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
