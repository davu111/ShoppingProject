const Product = require("../models/Product");

class ProductController {
  // [GET] /products
  getProducts(req, res, next) {
    Product.find({})
      .then((products) => res.json(products))
      .catch(next);
  }

  // [GET] /products/:id
  getProduct(req, res, next) {
    Product.findById(req.params.id)
      .then((product) => res.json(product))
      .catch(next);
  }

  //[PUT] /products/:id
  // [PUT] /products/:id
  async updateProduct(req, res, next) {
    const quantityToReduce = req.body.quantity;

    if (
      quantityToReduce === undefined ||
      typeof quantityToReduce !== "number" ||
      quantityToReduce <= 0
    ) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.amount < quantityToReduce) {
        return res.status(400).json({
          message: `Not enough stock for ${product.title}. Only ${product.amount} left.`,
        });
      }

      product.amount -= quantityToReduce;
      const updated = await product.save();
      res.json(updated);
    } catch (error) {
      console.error("Unexpected error:", error);
      next(error);
    }
  }
}

module.exports = new ProductController();
