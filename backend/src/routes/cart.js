const express = require("express");
const router = express.Router();
const cartController = require("../app/controllers/CartController");

router.get("/getCart/:id", cartController.getCart);
router.post("/addProduct/:id", cartController.addProduct);
router.put("/updateQuantity/:id", cartController.updateQuantity);
router.delete("/deleteProduct/:id/:product_id", cartController.deleteProduct);

module.exports = router;
