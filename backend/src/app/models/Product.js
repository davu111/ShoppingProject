const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
  title: String,
  price: Number,
  detail: String,
  img: String,
  amount: Number,
});

module.exports = mongoose.model("Product", Product);
