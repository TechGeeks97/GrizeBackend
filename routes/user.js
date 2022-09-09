const router = require("express").Router();
const { verifyToken, authorization } = require("../middleware/verifyToken");

const User = require("../models/User");
const Product = require("../models/Order");
const FeedBack = require("../models/UserProductRequest");
router.put("/:id", verifyToken, async (req, res) => {
  console.log("req", req.params);
  const user = await User.findOne({ _id: req.params.id });

  console.log("req", user);
  let body = { ...req.body };

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateUser });
  } catch (err) {
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
});

router.post("/addProduct", verifyToken, async (req, res) => {
  const newProductRequest = new FeedBack({
    productName: req.body.productName,
    userDetails: {
      name: res.user.username,
      email: res.user.email,
    },
  });
  try {
    const saveUserRequest = await newProductRequest.save();

    res
      .status(200)
      .send({ status: 200, data: "Request for Product add send successfully" });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "user product request", message: err });
  }
});
router.get("/allProductsRequest", verifyToken, async (req, res) => {
  try {
    const allProductRequest = await FeedBack.find().lean();
    res.status(200).send({ status: 200, data: allProductRequest });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "user product request", message: err });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({ status: 200, message: "User has been deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
});

router.get("/find/:id", verifyToken, authorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();

    const { password, ...others } = user;

    console.log("user", user);

    res.status(200).send({ status: 200, data: others });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
});

router.get("/", verifyToken, authorization, async (req, res) => {
  try {
    const query = req.query.new;

    // User.aggregate([{$project:{"password":0}}])
    const user = await Product.aggregate([
      { $match: { _id: "63060875aa768a7dc409fba0" } },

      {
        $lookup: {
          from: "orders",

          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["_id", "$products.productId"],
                },
              },
            },
          ],
          as: "details",
        },
      },
      // {$lookup:{from:"orders",localField:'products',foreignField:"item",as:'order_details'}}
    ]);
    //  query?await User.find({},{password:0}).sort({_id:-1}).limit(2): await User.find({},{password:0}).lean()

    res.status(200).send({ status: 200, data: user });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
});

router.get("/status", verifyToken, authorization, async (req, res) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
    ]);
    res.status(200).send({ status: 200, data });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
});
module.exports = router;
