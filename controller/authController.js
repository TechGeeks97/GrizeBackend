const bcrypt = require("bcrypt");
const User = require("../models/User");

const { generateToken } = require("../utils/ jwt");
const register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    location: req.body.location,
    phoneNumber: req.body.phoneNumber,
  });
  try {
    if (req.body.password != req.body.confirmPassword)
      return res
        .status(400)
        .send({ status: 400, message: "Password didnot match" });
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    newUser.password = await bcrypt.hash(newUser.password, salt);
    console.log("new User", newUser);
    let user = await newUser.save();
    const { password, ...otherUserInfo } = user._doc;
    res.status(200).send({ status: 200, data: otherUserInfo });
  } catch (error) {
    if (error?.code == 11000) {
      // Duplicate username

      let keys = Object.keys(error.keyPattern);

      return res
        .status(422)
        .send({ status: 422, message: `${keys[0]} already taken` });

      console.log("err mongo", error);
      // return res.status(422).send({ status:422, message: error.message });
    }

    // Some other error
    else {
      console.log("err", error);
      //   res.status(500).send({status:500,error})
      return res
        .status(422)
        .send({ status: 422, message: error?.message || error });
    }
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).lean();

    !user && res.status(401).send({ status: 401, message: "No User found" });

    if (user) {
      const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validatePassword) {
        let { password, ...others } = user;
        console.log("logs-----", user);
        var token = generateToken(others);
        console.log("token", token);
        res.status(200).send({ status: 200, data: { ...others, token } });
      } else {
        res.status(401).send({ status: 401, message: "Invalid Password" });
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ status: 500, error });
  }
};
module.exports = {
  register,
  login,
};
