const getUserSubscription = (req, res, next) => {
  const { subscriptionStatus, subscriptionExpiry } = res.user;
  const date = new Date(parseInt(subscriptionExpiry));
  const currentDate = Date.now();

  if (currentDate > date) {
    res.status(402).send({ status: 402, message: "ssubscription expired" });
    console.log("expire");
  } else {
    console.log("subscription not expired");
    next();
  }
};

module.exports = { getUserSubscription };
