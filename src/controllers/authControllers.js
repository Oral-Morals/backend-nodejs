const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




//@route POST '/signup'
//@desc Register/Signup a new user
//@access Public
exports.signup = async (req, res) => {
  try {
    // Search for existing user email
    const user = User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(401)
        .json({ message: "The email address you have entered is already associated with another account"});

    // If no user exists, save newly created user
    const newUser = new User({ ...req.body });
    const password = newUser.password;
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Save new user with hashed password
    const user_ = await newUser.create(newUser, hashedPassword);

    //Create Token
    // const token = await TokenModel.create({
    //   userID: user_.id,
    //   token: uuidv4(),
    //   expiresIn: moment().add(1, 'hours'),
    //   tokenType: 'email-verification'
    // })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
