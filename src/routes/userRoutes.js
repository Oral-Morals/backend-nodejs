const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const processInput = require("../middleware/process-input");
const checkMedia = require("../middleware/check-media");
const processOutput = require("../middleware/process-output");
const userController = require("../controllers/userController");

router.get("/users/:userID", authController.authorizeUser, userController.fetchProfile);

router.patch(
  "/users/profile",
  authController.authorizeUser,
  processInput.media,
  checkMedia.updateProperties,
  processOutput.uploadToCloudinary,
  userController.updateProfile
);

router.patch("/users/profile/deactivate", authController.authorizeUser, userController.deactivate);

module.exports = router;
