const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  total: { type: Number, default: 0 },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  payment: { type: String, default: "COD" },
  status: { type: String, default: "confirm" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", Order);
