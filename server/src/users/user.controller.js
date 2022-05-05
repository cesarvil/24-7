const Joi = require("joi");
require("dotenv").config();
const { v4: uuid } = require("uuid");
const { sendEmail } = require("./helpers/mailer");
const { generateJwt } = require("./helpers/generateJwt");
const User = require("./user.model");
const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//Use Joi to validate user schema
const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string()
    .required()
    .min(4)
    .error((errors) => {
      errors.some((err) => {
        if (err.code === "string.min") {
          err.message = `Password should have at least ${err.local.limit} characters!`;
        }
      });
      return errors;
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .error((errors) => {
      errors.some((err) => {
        if (err.code === "any.only") {
          err.message = "Passwords must match";
        }
      });
      console.log(errors);
      return errors;
    }),
  firstName: Joi.string()
    .required()
    .min(3)
    .error((errors) => {
      errors.some((err) => {
        if (err.code === "string.min") {
          err.message = `First Name should have at least ${err.local.limit} characters!`;
        }
      });
      return errors;
    }),
  surname: Joi.string()
    .min(3)
    .error((errors) => {
      errors.some((err) => {
        if (err.code === "string.min") {
          err.message = `Surname should have at least ${err.local.limit} characters!`;
        }
      });
      return errors;
    }),
  schedule: Joi.object(),
});

const Signup = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, options);
    //validation
    console.log(req.body);
    const result = userSchema.validate(req.body);
    if (result.error) {
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }
    //Check if the email has been already registered.
    var user = await User.findOne({
      email: result.value.email,
    });
    if (user) {
      return res.json({
        error: true,
        message: "Email is already in use",
      });
    }
    //hashing the password
    const hash = await User.hashPassword(result.value.password);
    const id = uuid(); //Generate unique id for the user.
    result.value.userId = id;
    //remove the confirmPassword field from the result as we dont need to save this in the db.
    delete result.value.confirmPassword;
    result.value.password = hash;
    let code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    let expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now
    const sendCode = await sendEmail(result.value.email, code);
    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }
    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);
    const newUser = new User(result.value);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: `User ${result.value.email} successfully registered. Please check your email for the activation code which must be entered the first time you log in to activate your account.`,
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
    });
  }
};

const Login = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI, options);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }
    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });
    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }
    //2. Throw error if account is not activated
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "You must verify your email to activate your account",
      });
    }
    //3. Verify the password is valid (using mongoose.Model.comparePasswords)
    const isValid = await User.comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const { error, token } = await generateJwt(user.email, user.userId); // do not put sensitive info like passwords here
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    //saving the JWT token to the database
    user.accessToken = token;

    await user.save();

    //Success
    return res.send({
      success: true,
      message: "User logged in successfully",
      accessToken: token, //Send it to the client
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

const Activate = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI, options);
    const { email, activationCode } = req.body;
    if (!email || !activationCode) {
      return res.json({
        error: true,
        status: 400,
        message: "Please make a valid request",
      });
    }
    const user = await User.findOne({
      email: email,
      emailToken: activationCode,
      emailTokenExpires: { $gt: Date.now() }, // check if the code is expired (vs Date.now() + 60 * 1000 * 15)
    });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details",
      });
    } else {
      if (user.active)
        return res.send({
          error: true,
          message: "Account already activated",
          status: 400,
        });
      user.emailToken = "";
      user.emailTokenExpires = null;
      user.active = true;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Account activated.",
      });
    }
  } catch (error) {
    console.error("activation-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const Logout = async (req, res) => {
  try {
    console.log("logout");
    mongoose.connect(process.env.MONGO_URI, options);
    const { id } = req.decoded;
    let user = await User.findOne({ userId: id });
    user.accessToken = "";
    await user.save();
    return res.send({ success: true, message: "User Logged out" });
  } catch (error) {
    console.error("user-logout-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    console.log("getuserinfo");
    mongoose.connect(process.env.MONGO_URI, options);
    let user = await User.findOne();

    console.log(user.email);

    return res.send({ success: true, message: "User Logged out" });
  } catch (error) {
    console.error("getuserinfor", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  Signup,
  Login,
  Activate,
  Logout,
  getUserInfo,
};
