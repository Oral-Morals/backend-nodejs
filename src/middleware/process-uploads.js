const multer = require("multer");

// Enable disk storage so files can be saved to this project.
const storage = multer.diskStorage({
  destination: "./src/uploads/",
  filename: function (req, file, cb) {
    console.log(file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Export multer to be used as middleware from this file.

// Process a single image.
module.exports.singleImage = multer({ storage: storage }).single("image");

// Process multiple media.
module.exports.multipleMedia = multer({ storage: storage }).fields([
  { name: "image" },
  { name: "video" },
  { name: "audio" },
]);
