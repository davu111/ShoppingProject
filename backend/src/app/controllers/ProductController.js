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
  updateProduct(req, res, next) {
    const quantityToReduce = req.body.quantity;

    Product.findById(req.params.id)
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        if (product.amount < quantityToReduce) {
          return res
            .status(400)
            .json({ message: `Not enough stock for ${product.name}` });
        }

        product.amount -= quantityToReduce;
        return product.save();
      })
      .then((updatedProduct) => res.json(updatedProduct))
      .catch(next);
  }
}

module.exports = new ProductController();
