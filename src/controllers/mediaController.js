const User = require("../models/userModel");

exports.uploadSingle = async (req, res) => {
  try {
    // multiple file uploads
    if (req.files) {
      return res.status(202).json({ status: "processing", data: { files: req.files } });
    }

    // single file upload
    return res.status(202).json({ status: "processing", data: { file: req.file } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
