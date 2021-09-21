const express = require("express");
const router = express.Router();
const Auth = require("../controllers/authControllers");
const Media = require("../controllers/mediaController");
const processInput = require("../middleware/process-input");
const processOutput = require("../middleware/process-output");
const checkMedia = require("../middleware/check-media");

router.post(
  "/profile-pic",
  Auth.authorizeUser,
  processInput.media,
  checkMedia.fileTypes,
  processOutput.uploadToCloudinary,
  Media.handleProfilePic
);

router.post(
  "/new-post",
  Auth.authorizeUser,
  processInput.media,
  checkMedia.fileTypes,
  processOutput.uploadToCloudinary,
  Media.createPost
);

module.exports = router;
