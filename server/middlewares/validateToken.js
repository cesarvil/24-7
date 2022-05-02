const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../src/users/user.model");
const mongoose = require("mongoose");

async function validateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  let result;
  if (!authorizationHeader)
    return res.status(401).json({
      error: true,
      message: "Access token is missing",
    });
  const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
  const options = {
    expiresIn: "1h",
  };
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let user = await User.findOne({
      accessToken: token,
    });

    if (!user) {
      result = {
        error: true,
        message: `Authorization error`,
      };
      return res.status(403).json(result);
    }
    result = jwt.verify(token, process.env.JWT_SECRET, options);
    if (!user.userId === result.id) {
      result = {
        error: true,
        message: `Invalid token`,
      };
      return res.status(401).json(result);
    }
    req.decoded = result; // append the result in the "decoded" field of req
    console.log(result);
    //token validation successful
    next();
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      result = {
        error: true,
        message: `TokenExpired`,
      };
    } else {
      result = {
        error: true,
        message: `Authentication error`,
      };
    }
    return res.status(403).json(result);
  }
}
module.exports = { validateToken };
