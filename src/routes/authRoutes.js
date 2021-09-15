const express = require("express");
const router = express.Router();
const Auth = require("../controllers/authControllers.js");

router.post("/eligibility/age", Auth.authorizeAge);
router.post("/signup", Auth.signup);
router.get("/verify/:token", Auth.emailVerification);
router.post("/login", Auth.login);
router.post("/resend", Auth.resendEmailVerToken);
router.post("/recover", Auth.passwordResetRequest);
router.post("/reset", Auth.passwordReset);

module.exports = router;
