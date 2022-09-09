const res = require("express/lib/response");
const paypal = require("paypal-rest-sdk");
const { schema } = require("../models/Payment");
const Payment = require("../models/Payment");
const ObjectId = require("mongoose").Types.ObjectId;
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
        payment.links.forEach(async (element) => {
          if (element.rel == "approval_url") {
            let findPayment = await Payment.find({
              orderId: ObjectId(req.params.orderId),
            }).lean();
            console.log("find payment", findPayment);
            if (findPayment.length == 0) {
              let schema = {
                userId: res?.user?._id,
                productId: req.params.productId,
                orderId: req.params.orderId,
                paymentDetail: {},
              };

              savePaymentDetail(schema);
            }
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
const paymentRefund = async (req, res) => {
  let findPayment = await Payment.find({
    orderId: req.params.orderId,
  }).lean();
  if (findPayment[0].refundRequest) {
    res
      .status(200)
      .send({ status: 200, data: "request for refund is already submitted" });
  } else {
    let schema = {
      ...findPayment,
      refundRequest: true,
    };
    await updatePayment(schema, req.params.orderId);
    res
      .status(200)
      .send({ status: 200, data: "request for refund successfully submitted" });
  }
};

const savePaymentDetail = async (body) => {
  const paymentObject = new Payment(body);
  const savePaymentInfo = await paymentObject.save();
  // res.status(200).send({ status: 200, data: savePaymentInfo });
};
const updatePayment = async (body, id) => {
  const updatedProduct = await Payment.findOneAndUpdate(
    {
      orderId: ObjectId(id),
    },
    body
  );
  console.log("updateproduct", updatedProduct);
};
const executePayment = async (req, res) => {
  try {
    // res.render("success");
    console.log("payerid", req.query);
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
    };

    const paymentInfo = paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          let orderId = payment.transactions[0].description;
          let findPayment = await Payment.find({
            orderId: orderId,
          }).lean();

          let schema = {
            ...findPayment,
            paymentDetail: payment,
          };
          await updatePayment(schema, orderId);
          // await savePaymentDetail(schema);
        }
        console.log(JSON.stringify(payment));
        res.render("success");
      }
    );
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
    console.log("err", err);
  }
};
const refundList = async (req, res) => {
  try {
    let getList = await Payment.find({ refundRequest: true }).lean();
    res.status(200).send({ status: 200, data: getList });
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
  }
};
module.exports = {
  getPayPalRedirectUrl,
  executePayment,
  savePaymentDetail,
  paymentRefund,
  refundList,
};
