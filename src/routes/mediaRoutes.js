const express = require("express");
const router = express.Router();
const Auth = require("../controllers/authControllers");
const Media = require("../controllers/mediaController");
const processInput = require("../middleware/process-input");
const processOutput = require("../middleware/process-output");

router.post(
  "/profile-pic",
  Auth.authorizeUser,
  processInput.profilePic,
  processOutput.uploadToCloudinary,
  Media.handleProfilePic
);

router.post(
  "/post/audio",
  Auth.authorizeUser,
  processInput.audio,
  processOutput.uploadToCloudinary,
  Media.handleProfilePic
);

router.post(
  "/post/video",
  Auth.authorizeUser,
  processInput.video,
  processOutput.uploadToCloudinary,
  Media.handleProfilePic
);
// router.post("/single", processUploads.multer.single("image"), Media.uploadSingle);

// router.post("/multiple", processUploads.multipleMedia, Media.uploadSingle);

module.exports = router;
