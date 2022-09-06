const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    productId: {
      type: mongoose.Schema.ObjectId,
    },
    quantity: {
      type: Number,
      default: 1,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },

    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    confirmOrder: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
