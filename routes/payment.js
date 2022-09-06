const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const { getUserSubscription } = require("../middleware/subscription");
const {
  getPayPalRedirectUrl,
  executePayment,
} = require("../controller/paymentController");

router.post("/", verifyToken, getUserSubscription, getPayPalRedirectUrl);
router.get("/success", executePayment);

module.exports = router;
