const Cart = require("../models/Cart");

class CartController {
  // [GET] /carts/:user_id (get products in cart)
  async getCart(req, res, next) {
    try {
      const userId = req.params.id;

      const cart = await Cart.findOne({ user: userId }).populate(
        "products.product"
      );

      if (!cart) return res.status(202).json([]);

      const sortedProducts = [...cart.products].sort(
        (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
      );

      const productsWithQuantity = sortedProducts.map((item) => {
        const product = item.product.toObject(); // chuyển về object JS thường
        product.quantity = item.quantity; // thêm quantity
        return product;
      });

      res.json(productsWithQuantity);
    } catch (error) {
      next(error);
    }
  }
  // [POST] /carts/createCart/:user_id
  async createCart(req, res, next) {
    try {
      const userId = req.params.id;
      const newCart = new Cart({ user: userId, products: [] });
      await newCart.save();
      res.json(newCart);
    } catch (error) {
      next(error);
    }
  }

  // [POST] /carts/:user_id (add product to cart)
  async addProduct(req, res, next) {
    try {
      const userId = req.params.id;
      const productId = req.body.product_id;
      const quantity = req.body.quantity;

      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        const newCart = new Cart({ user: userId, products: [] });
        await newCart.save();
        cart = newCart;
      }

      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.addedAt = new Date();
      } else {
        cart.products.push({
          product: productId,
          quantity: quantity,
          addedAt: new Date(),
        });
      }

      await cart.save();

      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  // [PUT] /carts/:user_id (change quantity of product in cart)
  async updateQuantity(req, res, next) {
    try {
      const userId = req.params.id;
      const quantites = req.body;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.products.forEach((item) => {
        const productId = item.product.toString();
        if (quantites[productId] && item.quantity !== quantites[productId]) {
          item.quantity = quantites[productId];
          item.addedAt = new Date();
        }
      });

      await cart.save();

      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /carts/:user_id/:product_id (delete product in cart)
  async deleteProduct(req, res, next) {
    try {
      const userId = req.params.id;
      const productId = req.params.product_id;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1)
        return res.status(404).json({ message: "Product not found in cart" });

      cart.products.splice(productIndex, 1);
      await cart.save();

      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /carts/:user_id (delete many products in cart)
  async deleteMany(req, res, next) {
    try {
      const userId = req.params.id;
      const productIds = req.body.productIds;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.products = cart.products.filter((item) => {
        return !productIds.includes(item.product.toString());
      });

      await cart.save();

      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
