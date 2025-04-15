const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");

router.get("/getUsers", userController.getUsers);

module.exports = router;
