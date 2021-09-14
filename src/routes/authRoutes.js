const express = require("express");
// const { check } = require('express-validator');
const router = express.Router();
const Auth = require("../controllers/authControllers.js");

router.post("/eligibility/age", Auth.authorizeAge);

router.post("/signup", Auth.signup);

module.exports = router;
