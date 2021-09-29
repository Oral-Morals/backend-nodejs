const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const processInput = require("../middleware/process-input");
const checkMedia = require("../middleware/check-media");
const processOutput = require("../middleware/process-output");
const userController = require("../controllers/userController");

router
  .route("/profile")
  .get(authController.authorizeUser, userController.fetchProfile)
  .patch(authController.authorizeUser, userController.updateProfile);

router.patch(
  "/profile-pic",
  authController.authorizeUser,
  processInput.media,
  checkMedia.updateProperties,
  processOutput.uploadToCloudinary,
  userController.updateProfilePic
);

module.exports = router;
