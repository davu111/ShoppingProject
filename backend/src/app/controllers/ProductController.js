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
}

module.exports = new ProductController();
