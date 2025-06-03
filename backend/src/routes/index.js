const productRouter = require("./product");
const userRouter = require("./user");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const chatBoxRouter = require("./chatbox");
const mailRouter = require("./mail");

function routes(app) {
  app.use("/products", productRouter);
  app.use("/users", userRouter);
  app.use("/carts", cartRouter);
  app.use("/orders", orderRouter);
  app.use("/api/chatbox", chatBoxRouter);
  app.use("/mails", mailRouter);
}

module.exports = routes;
