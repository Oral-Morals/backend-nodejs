const multer = require("../utils/multer-config");

// Exports the multer object.
exports.multer = multer;

// Process a single image for the profile picture.
exports.profilePic = multer.single("profilePic");

// Process multiple fields.
exports.media = multer.fields([
  { name: "audio", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
]);
