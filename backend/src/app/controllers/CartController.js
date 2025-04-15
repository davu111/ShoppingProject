const Cart = require("../models/Cart");

class CartController {
  // [GET] /carts
  getCarts(req, res, next) {
    Cart.find({})
      .then((carts) => res.json(carts))
      .catch(next);
  }
}

module.exports = new CartController();
