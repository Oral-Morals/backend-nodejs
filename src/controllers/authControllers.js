const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

moment().format();

//@route POST '/signup'
//@desc Register/Signup a new user
//@access Public
exports.signup = async (req, res) => {
  try {
    // Search for existing user email
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(401).json({
        message: "The email address you have entered is already associated with another account",
      });

    // If no user exists, generate salt and hash password
    const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.SALT));

    // Create new user
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      profilePicture: req.body.profilePicture,
      password: hashedPassword,
    });

    await newUser.save();

    //Create Token
    const token = jwt.sign({ newUser }, process.env.JWT_SECRET);

    return res.status(201).json({ message: "New User Created", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//@route POST '/signup'
//@desc Register/Signup a new user
//@access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // Search for existing user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        message: "The email " + email + " is not associated with any account. Double-check your email and try again.",
      });

    // If existing user is found, compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect Email or Password" });

    // If passwords match, log in the user
    return res.status(200).json({ message: "You are now logged in!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.authorizeAge = async (req, res, next) => {
  try {
    // Check if the user's age is under 18 years old

    const userDOB = moment(req.body.dateOfBirth);
    const earliestDOB = moment().subtract(18, "years");

    // If the user's DOB is after the earliest DOB to be 18 years old today,
    // the user is younger than 18 years old.
    if (userDOB.isAfter(earliestDOB)) {
      return res.status(403).json({ success: false, message: "User must be 18 or older to use app." });
    }

    // If the user's DOB is valid, the response is 200 and DOB is sent back to be used in the registration flow.
    if (!userDOB.isAfter(earliestDOB)) return res.status(200).json({ success: true, data: { dateOfBirth: userDOB } });

    // Go to next available middleware.
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.authorizeUser = async (req, res, next) => {
  try {
    // Check if authorization header credentials were sent with request.
    if (!req.headers.authorization) return res.status(401).json({ message: "Authorization header required" });

    // Check if the authorization type is Bearer.
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Authorization format is: Bearer <token>" });

    // Get the token from the authorization header by removing "Bearer " from the string.
    let token = req.headers.authorization.replace("Bearer ", "");

    // Returns the payload if the signature is valid.
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) return res.status(500).json({ error });

      // Check for invalid token.
      if (!decodedToken) return res.status(401).json({ message: "Invalid authorization token. Please login." });

      // The decodedToken values are the user's details.
      req.user = decodedToken;

      // Go to next available middleware.
      next();
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Server error. Possible error with token." });
  }
};
