const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const { getUserSubscription } = require("../middleware/subscription");
const {
  getPayPalRedirectUrl,
  executePayment,
  savePaymentDetail,
  paymentRefund,
  refundList,
} = require("../controller/paymentController");

router.post(
  "/:productId/:orderId",
  verifyToken,
  getUserSubscription,
  getPayPalRedirectUrl
);
router.get("/success", executePayment);
router.post("/invoice", verifyToken, savePaymentDetail);
router.put("/refund/:orderId", verifyToken, paymentRefund);
router.get("/refundList", verifyToken, refundList);

module.exports = router;
