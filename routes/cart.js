const router = require("express").Router();
const { verifyToken, authorization } = require("../middleware/verifyToken");

const Cart = require("../models/Cart");

router.post("/", verifyToken, async (req, res) => {
  const createCart = new Cart(req.body);
  try {
    const savesCart = await createCart.save();
    res.status(200).send({ status: 200, data: savesCart });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  console.log("req", req.params);
  // const user=await Product.findOne({_id:req.params.id});

  // console.log('req',user)
  let body = { ...req.body };

  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateCart });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update product", message: err });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({ status: 200, message: "Cart has been removed successfully" });
  } catch (err) {
    res.status(500).send({ status: 500, route: "delete cart", message: err });
  }
});

router.get("/find/:userId", verifyToken, authorization, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId }).lean();

    // const {password,...others}=user

    // console.log('user',user)

    res.status(200).send({ status: 200, data: cart });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "find cart", message: err });
  }
});
//get all
router.get("/", verifyToken, async (req, res) => {
  try {
    let carts = await Cart.find();
    res.status(200).send({ status: 200, data: carts });
  } catch (err) {
    res.status(500).send({ status: 500, route: "find cart", message: err });
  }
});

module.exports = router;
