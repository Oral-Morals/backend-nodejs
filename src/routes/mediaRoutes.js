const express = require("express");
const router = express.Router();
const Media = require("../controllers/mediaController");
const processUploads = require("../middleware/process-uploads");

router.post("/upload-single", processUploads.singleImage, Media.uploadSingle);

router.post("/upload-multiple", processUploads.multipleMedia, Media.uploadSingle);

module.exports = router;
