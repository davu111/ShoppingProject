const express = require("express");
const router = express.Router();
const chatboxController = require("../app/controllers/ChatboxController");

router.post("/getAnswer", chatboxController.getAnswer);

module.exports = router;
