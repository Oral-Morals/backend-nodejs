const User = require('../models/user');

//@route POST '/register'
//@desc Register user
//@access Public
exports.register = async (req, res) => {
  try {
    //access and acquire email address
    const { email } = req.body.email;

    // Make sure this account doesn't already exist
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(401)
        .json({ message: "The email address you have entered is already associated with another account"});

    // save newly created user
    const newUser = new User({ ...req.body });
    await User.register(newUser, req.body.password);
    const user_ = await newUser.save();
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
};
