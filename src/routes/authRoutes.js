const express = require("express");
const router = express.Router();
const Auth = require("../controllers/authControllers.js");
const Authorization = require("../middleware/authorization");

router.post("/eligibility/age", Authorization.age);

router.post("/signup", Auth.signup);
router.post("/login", Auth.login);

module.exports = router;
