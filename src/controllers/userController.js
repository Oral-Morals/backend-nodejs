const User = require("../models/userModel");

// Fetch user data.
exports.fetchProfile = async (req, res) => {
  console.log(req.user);
  // Find a user by their ID.
  // Use select(string) method to certain fields from being returned.
  // TODO: Are we sending back a user's email address if they not the account owner?
  let user = await User.findById(req.params.userID).select(
    "-password -dateOfBirth -role -isVerified -createdAt -updatedAt -__v -profilePicture.cloudinaryPublicID"
  );

  // If a user is requesting another user's account, delete the email property.
  if (req.user.id !== req.params.userID) {
    // Convert Mongoose document object to JavaScript object. Then delete the email property.
    user = user.toObject();
    delete user.email;
  }

  return res.status(200).json({ status: "success", data: user });
};

// Get the URL from Cloudinary and save to database.
exports.updateProfilePic = async (req, res) => {
  try {
    // Get user data.
    const user = await User.findOne({ _id: req.user.id });

    // Add profile picture link to user data.
    user.profilePicture = { link: req.cloudinary.secure_url, cloudinaryPublicID: req.cloudinary.public_id };

    await user.save();

    return res.status(200).json({ status: "success", message: "Profile picture updated." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Update user data.
exports.updateProfile = async (req, res) => {
  try {
    // Unpack the request body to use in the user model.
    const { name, username, languages, heritages, bio } = req.body;

    // Get user data.
    const user = await User.findOne({ _id: req.user.id });

    // Update name.
    user.name = name;

    // Update languages.
    user.languages = languages;

    // Update heritages.
    user.heritages = heritages;

    // Update bio.
    user.bio = bio;

    if (req.file) {
      // Add profile picture link to user data.
      user.profilePicture = { link: req.cloudinary.secure_url, cloudinaryPublicID: req.cloudinary.public_id };
    }

    await user.save();

    // Handle username.
    if (user.username !== username) {
      // Query the database for a username that matches the request body's username.
      const newUsername = await User.findOne({ username });

      // If that username already exists return a response
      // with all current profile data and a 409 status code with a message
      // saying the username is taken.
      if (newUsername) {
        return res.status(409).json({
          status: "fail",
          message: "Username is already taken. Any other data sent with this request has been updated.",
        });
      }

      // Set the user's username to the requested username and save.
      user.username = username;

      await user.save();
    }

    return res.status(200).json({ status: "success", message: "Profile updated." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Deactivate account.
exports.deactivate = async (req, res) => {
  try {
    // Check if field has a value.
    if (!req.body.isActivated) {
      return res.status(400).json({
        status: "fail",
        message: `The "isActivated" property does not have a value. The value should be false.`,
      });
    }

    if (req.body.isActivated === true) {
      return res.status(400).json({
        status: "fail",
        message: `This endpoint is only for account deactivations.`,
      });
    }
    // Get user data.
    const user = await User.findOne({ _id: req.user.id });

    // Update is isActivated to false.
    user.isActivated = false;

    await user.save();

    return res.status(200).json({ status: "success", message: `The account associated with ${user.email}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};
