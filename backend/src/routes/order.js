const express = require("express");
const router = express.Router();
const orderController = require("../app/controllers/OrderController");

router.get("/getOrders", orderController.getOrders);
router.get("/getOrder/:id", orderController.getOrder);
router.get("/statusStats", orderController.getOrderStatusStats);
router.get("/availableMonths", orderController.getAvailableMonths);
router.get("/topProducts", orderController.getTopProducts);
router.put("/updateOrder/:id/:orderId", orderController.updateOrder);
router.post("/createOrder/:id", orderController.createOrder);
router.delete("/deleteOrder/:id/:orderId", orderController.deleteOrder);

module.exports = router;
