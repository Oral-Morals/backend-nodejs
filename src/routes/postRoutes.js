const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const processInput = require("../middleware/process-input");
const checkMedia = require("../middleware/check-media");
const processOutput = require("../middleware/process-output");
const postController = require("../controllers/postController");

router.get("/posts", authController.authorizeUser, postController.fetchPosts);

router.get("/posts/:id", authController.authorizeUser, postController.fetchSinglePost);

// router.get("/posts/user/:id", authController.authorizeUser, postController.fetchUserPosts);

router.post(
  "/posts/new-post",
  authController.authorizeUser,
  processInput.media,
  checkMedia.updateProperties,
  processOutput.uploadToCloudinary,
  postController.createPost
);

module.exports = router;
