const User = require("../models/userModel");

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
