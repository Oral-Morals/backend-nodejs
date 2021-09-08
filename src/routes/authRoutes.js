const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const Auth = require('../controllers/authControllers.js');

router.post('/register', Auth.registration);

module.exports = router;
