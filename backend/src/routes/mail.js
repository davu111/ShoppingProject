const express = require("express");
const router = express.Router();
const mailController = require("../app/controllers/MailVerificationController");

router.post("/send-code", mailController.sendCode);
router.post("/verify-code", mailController.verifyCode);

module.exports = router;
