const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const processInput = require("../middleware/process-input");
const checkMedia = require("../middleware/check-media");
const processOutput = require("../middleware/process-output");
const userController = require("../controllers/userController");

router.patch(
  "/profile-pic",
  authController.authorizeUser,
  processInput.media,
  checkMedia.updateProperties,
  processOutput.uploadToCloudinary,
  userController.updateProfilePic
);

router.patch("/profile", authController.authorizeUser, userController.updateProfile);

module.exports = router;
