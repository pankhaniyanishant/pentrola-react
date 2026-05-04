const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
    }]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
