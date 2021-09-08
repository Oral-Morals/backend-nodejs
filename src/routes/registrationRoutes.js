const express = require('express');
const router = express.Router();
const { registration } = require('../controllers/registrationController.js');

router.get('/register', registration);

module.exports = router;
