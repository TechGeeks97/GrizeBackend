const User = require("../models/User");
const { generateToken } = require("../utils/ jwt");
const changeSubscriptionStatus = async (req, res) => {
  let subscriptionExpiry = Date.now() + 364 * 24 * 60 * 60 * 1000;

  let userData = ({ token, exp, ...others } = res.user);

  let userSchema = {
    ...others,
    subscriptionExpiry,
    subscriptionStatus: req.body.status,
  };

  const accessToken = generateToken(userSchema);
  try {
    const updateUser = await User.findByIdAndUpdate(
      res.user._id,
      {
        $set: userSchema,
      },
      { new: true }
    ).lean();
    const { password, ...others } = updateUser;
    res
      .status(200)
      .send({ status: 200, message: { ...others, token: accessToken } });
  } catch (err) {
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
};
module.exports = {
  changeSubscriptionStatus,
};
