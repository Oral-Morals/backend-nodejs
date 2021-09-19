const multer = require("../utils/multer-config");

// Exports the multer object.
exports.multer = multer;

// Process a single image for the profile picture.
exports.profilePic = multer.single("profilePic");

// Process a single audio post including both audio and image files.
exports.audioPost = multer.fields([
  { name: "audio", maxCount: 1 },
  { name: "audioImage", maxCount: 1 },
]);

// Process a single image for the audio post.
exports.audioImage = multer.single("audioImage");

// Process a single video.
exports.video = multer.single("video");
