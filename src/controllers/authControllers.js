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
      email: req.body.email,
      password: hashedPassword,
      dateOfBirth: req.body.dateOfBirth,
      username: req.body.username,
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
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
      });

    // If user
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
