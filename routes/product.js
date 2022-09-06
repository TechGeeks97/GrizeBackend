const router = require("express").Router();
const { verifyToken, authorization } = require("../middleware/verifyToken");
const { getUserSubscription } = require("../middleware/subscription");
const {
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controller/productController");

router.post("/", verifyToken, createProduct);

router.put("/:id", verifyToken, getUserSubscription, updateProduct);

router.get("/", verifyToken, getUserSubscription, getAllProducts);

router.get("/find/:id", verifyToken, getUserSubscription, findProductById);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
