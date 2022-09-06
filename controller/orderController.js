const Product = require("../models/Product");

const Order = require("../models/Order");
const { createandUpdateOrder } = require("../services/orders");
const createOrder = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId).lean();
    let validateRequest = await createandUpdateOrder(product, req.body);

    if (validateRequest == 402) {
      res.status(402).send({ status: 402, message: "Product doesnot exist" });
    } else {
      const saveOrder = await validateRequest.save();
      res.status(200).send({ status: 200, data: saveOrder });
    }
  } catch (err) {
    res.status(500).send({ status: 500, messgae: err });
  }
};
const updateOrder = async (req, res) => {
  try {
    const orderDetail = await Order.findById(req.params.id).lean();

    let payload = {
      amount: orderDetail.amount + req.body.amount,
    };
    let product = {
      price: orderDetail.totalAmount,
      _id: orderDetail.productId,
    };
    let validateRequest = await createandUpdateOrder(product, payload);

    if (validateRequest == 402) {
      res.status(402).send({ status: 402, message: "Product doesnot exist" });
    } else {
      const { _id, ...payload } = validateRequest._doc;

      const updatedProduct = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: payload,
        },
        { new: true }
      );

      res.status(200).send({ status: 200, message: updatedProduct });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, messgae: err });
  }
};
const getAllOrder = async (req, res) => {
  try {
    let orders = await Order.find();
    res.status(200).send({ status: 200, data: orders });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "find all orders", message: err });
  }
};
const getUserOrders = async (req, res) => {
  try {
    console.log("userid", req.params.userId);
    const order = await Order.aggregate([
      { $match: { userId: req.params.userId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, //for getting result in object
    ]);
    // Order.find({ userId: req.params.userId }).lean();

    // const {password,...others}=user

    // console.log('user',user)

    res.status(200).send({ status: 200, data: order });
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "find user order", message: err });
  }
};
module.exports = {
  createOrder,
  updateOrder,
  getAllOrder,
  getUserOrders,
};
