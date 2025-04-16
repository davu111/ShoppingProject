const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");

router.get("/getUser/:id", userController.getUser);
router.put("/updateUser/:id", userController.updateUser);
router.post("/createUser", userController.createUser);
router.post("/login", userController.login);

module.exports = router;
