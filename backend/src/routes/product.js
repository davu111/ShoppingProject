const express = require("express");
const router = express.Router();
const productController = require("../app/controllers/ProductController");

router.get("/getProducts", productController.getProducts);
router.get("/getProduct/:id", productController.getProduct);
router.put("/updateProduct/:id", productController.updateProduct);

module.exports = router;
