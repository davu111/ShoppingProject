const Order = require("../models/Order");

class OrderController {
  // [GET] /orders (get all orders)
  async getOrders(req, res, next) {
    try {
      const orders = await Order.find().sort({ date: -1 });
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  // [GET] /order/:id (status)
  async getOrder(req, res, next) {
    try {
      const userId = req.params.id;
      const status = req.query.status;

      const orders = await Order.find({ user: userId, status }).sort({
        date: -1,
      });
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  // [POST] /orders/:userId (create new order)
  async createOrder(req, res, next) {
    try {
      const userId = req.params.id;
      const products = req.body.products;
      const total = req.body.total;
      const payment = req.body.payment;
      const phone = req.body.phone;
      const address = req.body.address;

      const order = new Order({
        user: userId,
        products,
        total,
        payment,
        phone,
        address,
      });
      await order.save();
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  // [PUT] /orders/:userId/:orderId (update order)
  async updateOrder(req, res, next) {
    try {
      const userId = req.params.id;
      const orderId = req.params.orderId;
      const updatedOrder = req.body;
      await Order.updateOne({ _id: orderId, user: userId }, updatedOrder);
      res.json({ message: "Order updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /orders/:userId/:orderId (delete order)
  async deleteOrder(req, res, next) {
    try {
      const userId = req.params.id;
      const orderId = req.params.orderId;
      await Order.deleteOne({ _id: orderId, user: userId });
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
