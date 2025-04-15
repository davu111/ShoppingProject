const express = require("express");
const router = express.Router();
const cartController = require("../app/controllers/CartController");

router.get("/getCarts", cartController.getCarts);

module.exports = router;
