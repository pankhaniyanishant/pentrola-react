const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: String },
    image: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    category: { type: String },
    stock: { type: Number, required: true }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: { type: String, required: true },
    items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
