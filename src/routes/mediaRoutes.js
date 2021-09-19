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
  processOutput.profilePicToCloudinary,
  Media.handleProfilePic
);
// router.post("/single", processUploads.multer.single("image"), Media.uploadSingle);

// router.post("/multiple", processUploads.multipleMedia, Media.uploadSingle);

module.exports = router;
