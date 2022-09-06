const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.CLIENTID,
  client_secret: process.env.CLIENTSECRET,
});
const getPayPalRedirectUrl = async (req, res) => {
  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/api/payment/success",
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        {
          ...req.body,
          // req.body
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        payment.links.forEach((element) => {
          if (element.rel == "approval_url") {
            res.status(200).send({ status: 200, data: { url: element.href } });
            // res.redirect(element.href)
          }
        });
        // res.send('test')
      }
    });
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
  }
};
const executePayment = async (req, res) => {
  try {
    res.render("success");
    console.log("payerid", req.query);
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
    };

    const paymentInfo = paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.render("success");
        }
      }
    );

    console.log("paymentInfo", paymentInfo);
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
    console.log("err", err);
  }
};
module.exports = {
  getPayPalRedirectUrl,
  executePayment,
};
