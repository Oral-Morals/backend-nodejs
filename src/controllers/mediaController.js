const User = require("../models/userModel");

exports.handleProfilePic = async (req, res) => {
  try {
    // Get profile picture URL from Cloudinary and save to database.
    console.log(req.cloudinary);
    return res.status(202).json({ status: "processing", data: { file: req.files } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// multiple file uploads
// if (req.files) {
//   return res.status(202).json({ status: "processing", data: { files: req.files } });
// }
