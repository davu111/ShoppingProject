const Order = require("../models/Order");

class OrderController {
  // [GET] /orders (get all orders)
  async getOrders(req, res, next) {
    try {
      const sortBy = req.query.sortBy || "date"; // mặc định: date
      const direction = req.query.direction === "asc" ? 1 : -1;

      if (sortBy === "status") {
        // Custom sort for status
        const statusOrder = ["confirm", "shipping", "completed", "reject"];

        const orders = await Order.aggregate([
          {
            $addFields: {
              statusOrder: {
                $indexOfArray: [statusOrder, "$status"],
              },
            },
          },
          {
            $sort: {
              statusOrder: direction,
            },
          },
          {
            $project: {
              statusOrder: 0, // loại bỏ field phụ
            },
          },
        ]);

        return res.json(orders);
      }

      const orders = await Order.find().sort({ [sortBy]: direction });
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

  // [GET] /orders/statusStats
  async getOrderStatusStats(req, res, next) {
    try {
      const { month } = req.query; // format: "2025-5"
      const match = {};

      if (month && month !== "All") {
        const [year, m] = month.split("-").map(Number);
        const start = new Date(year, m - 1, 1);
        const end = new Date(year, m, 1);
        match.date = { $gte: start, $lt: end };
      }

      const stats = await Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getAvailableMonths(req, res, next) {
    try {
      const months = await Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                { $toString: "$_id.month" },
              ],
            },
          },
        },
        { $sort: { month: -1 } },
      ]);

      res.json(months.map((item) => item.month));
    } catch (error) {
      next(error);
    }
  }

  // [GET] /orders/topProducts
  async getTopProducts(req, res, next) {
    try {
      const { month } = req.query;
      const match = {};

      if (month && month !== "All") {
        const [year, m] = month.split("-").map(Number);
        const start = new Date(year, m - 1, 1);
        const end = new Date(year, m, 1);
        match.date = { $gte: start, $lt: end };
      }

      const topProducts = await Order.aggregate([
        { $match: match },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product",
            totalSold: { $sum: "$products.quantity" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            name: "$product.title",
            totalSold: 1,
          },
        },
      ]);

      res.json(topProducts);
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
