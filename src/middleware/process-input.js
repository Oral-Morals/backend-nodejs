const multer = require("../utils/multer-config");

// Process multiple fields.
exports.media = multer.fields([
  { name: "audio", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
]);
