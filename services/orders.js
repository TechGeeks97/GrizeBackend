const Product = require("../models/Product");

const Order = require("../models/Order");
const createandUpdateOrder = async (product, body) => {
  try {
    const createOrder = new Order(body);
    console.log("product------xs", product);
    if (product) {
      console.log("product------if");
      createOrder.totalAmount = product.price;

      if (body.amount >= product.price) {
        createOrder.paymentStatus = "payment completed";
      } else {
        createOrder.paymentStatus = "pending";
      }

      console.log("create order", createOrder);
      return createOrder;
    } else {
      return 402;
    }
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};
module.exports = {
  createandUpdateOrder,
};
