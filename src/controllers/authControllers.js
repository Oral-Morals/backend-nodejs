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
    // Check if the user's age is under 18 years old

    const userDOB = moment(req.body.dateOfBirth);
    const earliestDOB = moment().subtract(18, "years");

    // If the user's DOB is after the earliest DOB to be 18 years old today,
    // the user is younger than 18 years old.
    if (userDOB.isAfter(earliestDOB))
      return res.status(403).json({ message: "User must be 18 or older to use app." });

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
      dateOfBirth: req.body.dateOfBirth,
      username: req.body.email,
    });

    await newUser.save();

    //Create Token
    const token = await jwt.sign({ newUser }, process.env.JWT_SECRET);

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
        message:
          "The email " +
          email +
          " is not associated with any account. Double-check your email and try again.",
      });
    // If existing user is found, compare passwords and log in the user
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect Email or Password" });
    return res.status(200).json({ message: "You are now logged in!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
