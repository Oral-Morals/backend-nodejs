const express = require("express");
const router = express.Router();

router.get("/mobile-app", (req, res) => {
  return res.status(200).json({ status: "success", message: "GET request from mobile app to server. Nice!" });
});

router.post("/mobile-app", (req, res) => {
  return res
    .status(200)
    .json({
      status: "success",
      message: "POST request from mobile app to server. Nice! I sent back the data you submitted!",
      data: req.body.name,
    });
});

module.exports = router;
