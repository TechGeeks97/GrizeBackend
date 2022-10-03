const comman = require("../utils/common");
const { subscriptionPlans } = comman;
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscriptionStatus: {
      type: String,
      default: subscriptionPlans.free,
    },
    subscriptionExpiry: {
      type: String,
      default: Date.now() + 19 * 24 * 60 * 60 * 1000,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
