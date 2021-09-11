const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    // Generate salt and hash password
    // const salt = await bcrypt.genSalt(process.env.SALT);
    const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.SALT));

    // If no user exists, create new user
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      password: hashedPassword,
      followers: req.body.followers,
      following: req.body.following,
      role: req.body.role,
      country: req.body.country,
      ethnicity: req.body.ethnicity,
      language: req.body.language,
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
