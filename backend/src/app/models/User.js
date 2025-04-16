const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  account: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  address: String,
  phone: String,
  email: String,
});

module.exports = mongoose.model("User", User);
