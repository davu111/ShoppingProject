const productRouter = require("./product");
const userRouter = require("./user");
const cartRouter = require("./cart");
const orderRouter = require("./order");

function routes(app) {
  app.use("/products", productRouter);
  app.use("/users", userRouter);
  app.use("/carts", cartRouter);
  app.use("/orders", orderRouter);
}

module.exports = routes;
