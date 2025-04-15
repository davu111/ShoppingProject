const productRouter = require("./product");
const userRouter = require("./user");
const cartRouter = require("./cart");

function routes(app) {
  app.use("/products", productRouter);
  app.use("/users", userRouter);
  app.use("/carts", cartRouter);
}

module.exports = routes;
