const express = require("express");
const router = express.Router();
const Media = require("../controllers/mediaController");
const multer = require("multer");
const path = require("path");
// const upload = multer({ dest: "../uploads" });

const storage = multer.diskStorage({
  // destination: "../uploads/",
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/");
  },
  filename: function (req, file, cb) {
    // console.log(file);
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/upload-single", upload.single("image"), Media.uploadSingle);

router.post(
  "/upload-multiple",
  upload.fields([{ name: "image" }, { name: "video" }, { name: "audio" }]),
  Media.uploadSingle
);

module.exports = router;
