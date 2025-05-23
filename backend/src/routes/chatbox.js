const express = require("express");
const router = express.Router();
const chatboxController = require("../app/controllers/chatbox.controller");

router.post("/getAnswer", chatboxController.getAnswer);

module.exports = router;