// This file was created to accommodate multiple different file uploads from a single post request.

const transferObjectProperties = (originalObj) => {
  const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = originalObj;
  return { fieldname, originalname, encoding, mimetype, destination, filename, path, size };
};

exports.updateProperties = async (req, res, next) => {
  // Object destructure to get properties and values from req.files to req.file
  // to be used with cloudinary's upload method.

  try {
    //===========================================
    // Handles profile picture
    //===========================================

    if (req.path === "/profile-pic") {
      // Checks for the correct route, the correct form field, and if there is more than one form field
      // return an error response.
      if (req.files.profilePic && Object.keys(req.files).length > 1) {
        return res
          .status(400)
          .json({ status: "fail", message: "Only the profilePic form field should be filled out for this request." });
      }

      if (req.files.profilePic) {
        req.file = transferObjectProperties(req.files.profilePic[0]);
      }
    }

    //===========================================
    // Handles new posts
    //===========================================

    if (req.path === "/new-post") {
      // Check if the post caption is present and return error if it is not.
      if (!req.body.caption)
        return res.status(400).json({ status: "fail", message: "The caption field must be filled out." });

      // Check if audio and video is uploaded at the same time and
      // return an error is both were in the same request.
      if (req.files.audio && req.files.video) {
        return res
          .status(400)
          .json({ status: "fail", message: "Audio and video media types not allowed in the same request." });
      }

      if (req.files.audio && req.files.image) {
        req.file = transferObjectProperties(req.files.audio[0]);
        req.file.image = transferObjectProperties(req.files.image[0]);
      }

      if (req.files.video) req.file = transferObjectProperties(req.files.video[0]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }

  next();
};
