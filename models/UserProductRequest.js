const mongoose = require("mongoose");
const requestFeedbackSchema = new mongoose.Schema(
  {
    userDetails: {
      type: Object,
    },
    productName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("requestFeedbackSchema", requestFeedbackSchema);
