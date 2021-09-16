const express = require("express");
const router = express.Router();
const Media = require("../controllers/mediaController");
const processUploads = require("../middleware/process-uploads");

router.post("/single", processUploads.singleImage, Media.uploadSingle);

router.post("/multiple", processUploads.multipleMedia, Media.uploadSingle);

module.exports = router;
