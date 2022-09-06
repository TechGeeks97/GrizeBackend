const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51LaOC8SIAZXojiOB4aQCzLGAs2GVP0hamQkZGOx3w7pQWHjitwGeOi0OscuCT1fN3zJ5OV7hCegGS4jyDMhTfzj200BfuxCPpS"
);
router.post("/createCustomer", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      description:
        "My First Test Customer (created for API docs at https://www.stripe.com/docs/api)",
    });
    res.status(200).send({ status: 200, data: customer });
  } catch (err) {
    console.log("err", err);

    res.status(500).send({ status: 500, data: err });
  }
});
router.post("/payment", async (req, res) => {
  try {
    console.log("req", req.body.id);

    const card = await stripe.customers.createSource("cus_MJALWY1XZidXgJ", {
      source: `tok_${req.body.card.brand}`,
    });

    stripe.charges.create(
      {
        source: `tok_${req.body.card.brand}`,
        amount: 300,
        currency: "usd",
      },
      (stripeErr, stripeResponse) => {
        if (stripeErr) {
          console.log("stripe err", stripeErr);
          res.status(500).json(stripeErr);
        } else {
          console.log("response", stripeResponse);
          res.status(200).send(stripeResponse);
        }
      }
    );
    console.log("charge", charge);
  } catch (err) {
    console.log("err", err);
  }
});
module.exports = router;
