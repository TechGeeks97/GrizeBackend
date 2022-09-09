const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },

    paymentDetail: {
      type: Object,
      required: true,
    },
    refundRequest: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
