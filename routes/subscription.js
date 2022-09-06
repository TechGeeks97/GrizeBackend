const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
  changeSubscriptionStatus,
} = require("../controller/subscriptionController");

router.put("/", verifyToken, changeSubscriptionStatus);
module.exports = router;
