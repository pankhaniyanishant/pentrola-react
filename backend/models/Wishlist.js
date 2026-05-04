const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 },
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
    user: { type: String, required: true },
    items: [wishlistItemSchema],
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;