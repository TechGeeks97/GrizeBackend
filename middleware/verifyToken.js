const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["x-access-token"];

    if (authHeader) {
      jwt.verify(authHeader, "JSONWEBTOKEN", (err, user) => {
        if (err)
          res.status(403).send({ status: 403, message: "Token is not valid" });
        res.user = user;
        next();
      });
    } else {
      return res.status(401).send("Your are not authenticated");
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err });
  }
};

const authorization = (req, res, next) => {
  if (res.user.isAdmin) {
    next();
  } else {
    res.status(403).send({ status: 403, message: "You are not Authorized" });
  }
};
module.exports = { verifyToken, authorization };
