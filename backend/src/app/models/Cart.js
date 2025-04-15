const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cart = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    total: { type: Number, default: 0 }
});


module.exports = mongoose.model("Cart", Cart);