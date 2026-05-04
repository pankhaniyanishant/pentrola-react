const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String },
    stock: { type: Number, required: true, default: 0 },
    isBestseller: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
