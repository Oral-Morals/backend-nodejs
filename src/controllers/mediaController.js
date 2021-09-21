const User = require("../models/userModel");
const Post = require("../models/postModel");

// Get the URL from Cloudinary and save to database.
exports.handleProfilePic = async (req, res) => {
  try {
    // Get user data.
    const user = await User.findOne({ _id: req.user.id });

    // Add profile picture link to user data.
    user.profilePicture = { link: req.cloudinary.secure_url, cloudinaryPublicID: req.cloudinary.public_id };

    await user.save();

    return res.status(200).json({ success: true, data: { message: "Profile picture updated." } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the URL from Cloudinary and save to database
exports.createPost = async (req, res) => {
  try {
    // Create new post from upload form.
    const newPost = await Post.create({
      userId: req.user.id,
      caption: req.body.caption,
      mediaType: req.file.fieldname,
      mediaLink: { link: req.cloudinary.secure_url, cloudinaryPublicID: req.cloudinary.public_id },
    });

    await newPost.save();

    return res.status(200).json({ success: true, data: { message: `New ${newPost.mediaType} post created.` } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
