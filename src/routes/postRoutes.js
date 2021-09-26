const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const processInput = require("../middleware/process-input");
const checkMedia = require("../middleware/check-media");
const processOutput = require("../middleware/process-output");
const postController = require("../controllers/postController");

router.post(
  "/new-post",
  authController.authorizeUser,
  processInput.media,
  checkMedia.updateProperties,
  processOutput.uploadToCloudinary,
  postController.createPost
);

module.exports = router;
