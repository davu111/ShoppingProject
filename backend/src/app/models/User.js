const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    account: String,
    password: String,
    role: String
});

module.exports = mongoose.model("User", User);