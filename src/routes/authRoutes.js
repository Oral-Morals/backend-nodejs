const express = require("express");
const router = express.Router();
const Auth = require("../controllers/authControllers");

router.post("/auth/eligibility/age", Auth.authorizeAge);

router.post("/auth/signup", Auth.signup);

router.get("/auth/verify/:token", Auth.emailVerification);

router.post("/auth/login", Auth.login);

router.post("/auth/resend", Auth.resendEmailVerToken);

router.post("/auth/recover", Auth.passwordResetRequest);

router.post("/auth/reset", Auth.passwordReset);

module.exports = router;
