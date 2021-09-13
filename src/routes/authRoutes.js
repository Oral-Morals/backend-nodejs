const express = require("express");
// const { check } = require('express-validator');
const router = express.Router();
const Auth = require("../controllers/authControllers.js");
const Authorization = require("../middleware/authorization");

router.post("/eligibility/age", Authorization.age);

router.post("/signup", Auth.signup);

module.exports = router;
