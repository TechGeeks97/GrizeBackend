const router = require("express").Router();
const { verifyToken, authorization } = require("../middleware/verifyToken");

const Product = require("../models/Product");

const createProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savesProduct = await newProduct.save();
    res.status(200).send({ status: 200, data: savesProduct });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};

const findProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    res.status(200).send({ status: 200, data: product });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "find product", message: err });
  }
};
const updateProduct = async (req, res) => {
  let body = { ...req.body };

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updatedProduct });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update product", message: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({ status: 200, message: "User has been deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "delete product", message: err });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const query = req.query;

    let filterSchema = {};
    let queries = Object.keys(query);
    queries.map((key) => {
      switch (key) {
        case "store_name":
          filterSchema = { ...filterSchema, [key]: { $in: [query[key]] } };
          break;
        case "title":
          filterSchema = { ...filterSchema, [key]: { $in: [query[key]] } };
          break;
        case "latest":
          break;
      }
    });

    let products;

    products = await Product.find(filterSchema);

    res.status(200).send({ status: 200, data: products });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "products", message: err });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  findProductById,
  updateProduct,
  deleteProduct,
};
