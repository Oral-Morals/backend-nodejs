// This file was created to accommodate multiple different file uploads from a single post request.

exports.fileTypes = async (req, res, next) => {
  // Object destructure to get properties and values from req.files to req.file
  // to be used with cloudinary's upload method.
  const transferObjectProperties = (originalObj) => {
    const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = originalObj;
    return { fieldname, originalname, encoding, mimetype, destination, filename, path, size };
  };

  try {
    // console.log("src/middleware/check-media---logging: req.files:");
    // console.log(req.files);

    //===========================================
    // Handles profile picture
    //===========================================

    // Checks for the correct route, the correct form field, and if there is more than one form field
    // return an error response.
    if (req.path === "/profile-pic" && req.files.profilePic && Object.keys(req.files).length === 1) {
      req.file = transferObjectProperties(req.files.profilePic[0]);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Only the profilePic form field should be filled out for this request." });
    }

    //===========================================
    // Handles new posts
    //===========================================

    // Check if audio and video is uploaded at the same time and
    // return an error is both were in the same request.
    if (req.path === "/new-post" && req.files.audio && req.files.video) {
      return res
        .status(400)
        .json({ success: false, message: "Audio and video media types not allowed in the same request." });
    }

    if (req.files.audio) req.file = transferObjectProperties(req.files.audio[0]);

    if (req.files.video) req.file = transferObjectProperties(req.files.video[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }

  next();
};
