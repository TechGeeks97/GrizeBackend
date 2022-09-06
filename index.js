require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripe");
const paymentRoute = require("./routes/payment");
const subscriptionRoutes = require("./routes/subscription");

var bodyParser = require("body-parser");

const cors = require("cors");

// dotenv.config({path:__dirname+'/.env'});
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// console.log('jj',__dirname+'/.env');
const mongoDb = async () => {
  const URI = process.env.MONGOURL;

  console.log("URI", URI);
  try {
    let connection = mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    // console.log('connected mongodb',connection)
  } catch (err) {
    console.log("err", err);
  }
};
mongoDb();

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/subscription", subscriptionRoutes);

app.use("/api/payment", paymentRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/stripe", stripeRoutes);

// mongoose.connection.once('open',()=>console.log('connected')).on('error',(error)=>{
// console.log("error"m)
// })
app.listen(process.env.PORT || 3000, () => {
  console.log("Backend server is running");
});
// console.log("yes")
