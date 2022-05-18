const jwt = require("jsonwebtoken");
require("dotenv").config();
const options = {
  //setting expire time for the token
  expiresIn: "5h",
};
async function generateJwt(email, userId) {
  try {
    //payload contains certain info we can decode later
    const payload = { email: email, id: userId };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
    return { error: false, token: token };
  } catch (error) {
    return { error: true };
  }
}
module.exports = { generateJwt };
