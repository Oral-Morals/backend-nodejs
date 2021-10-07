// This file was created to accommodate multiple different file uploads from a single post request.

// Object destructure to get properties and values from req.files to req.file
// to be used with cloudinary's upload method.
const transferObjectProperties = (originalObj) => {
  const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = originalObj;
  return { fieldname, originalname, encoding, mimetype, destination, filename, path, size };
};

exports.updateProperties = async (req, res, next) => {
  try {
    //===========================================
    // Handles profile picture
    //===========================================

    if (req.path === "/users/profile") {
      // Skip processing if there is no file uploaded.
      if (!req.files) {
        return next();
      }

      // Checks for the correct route, the correct form field, and if there is more than one form field
      // return an error response.
      if (req.files.profilePic && Object.keys(req.files).length > 1) {
        return res.status(400).json({
          status: "fail",
          message: "This route only accepts uploads to the profilePic field and json in the body",
        });
      }

      if (req.files.profilePic) {
        req.file = transferObjectProperties(req.files.profilePic[0]);
      }
    }

    //===========================================
    // Handles new posts
    //===========================================

    if (req.path === "/posts/new-post") {
      // If there are no files uploaded, return an error response.
      if (Object.keys(req.files).length === 0) {
        return res.status(400).json({ status: "fail", message: "An audio or video file was NOT uploaded." });
      }

      // Check if audio and video is uploaded at the same time and
      // return an error is both were in the same request.
      if (req.files.audio && req.files.video) {
        return res
          .status(400)
          .json({ status: "fail", message: "Audio and video media types not allowed in the same request." });
      }

      // Check if the post caption is present and return an error if it is not.
      if (!req.body.caption)
        return res.status(400).json({ status: "fail", message: "The caption field must be filled out." });

      // If a video file was uploaded extract the object from req.files to req.file.
      if (req.files.video) {
        req.file = transferObjectProperties(req.files.video[0]);
        return next();
      }

      // If a audio and image file was uploaded extract the object from req.files to req.file.
      if (req.files.audio && req.files.image) {
        req.file = transferObjectProperties(req.files.audio[0]);
        req.file.image = transferObjectProperties(req.files.image[0]);
        return next();
      }
      return res.status(400).json({ status: "fail", message: "An audio or video file was NOT uploaded. " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }

  next();
};
