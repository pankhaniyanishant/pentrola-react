const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.params.userId });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.params.userId, items: [] });
        }
        
        const itemsWithStock = await Promise.all(wishlist.items.map(async (item) => {
            try {
                const product = await Product.findById(item.id);
                return {
                    ...item.toObject(),
                    stock: product ? product.stock : 0
                };
            } catch (e) {
                return {
                    ...item.toObject(),
                    stock: 0
                };
            }
        }));
        
        res.json({ ...wishlist.toObject(), items: itemsWithStock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:userId', async (req, res) => {
    try {
        const { items } = req.body;
        
        const validItems = await Promise.all(items.map(async (item) => {
            try {
                const product = await Product.findById(item.id);
                return {
                    ...item,
                    stock: product ? product.stock : (item.stock || 0)
                };
            } catch (e) {
                return {
                    ...item,
                    stock: item.stock || 0
                };
            }
        }));

        let wishlist = await Wishlist.findOne({ user: req.params.userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.params.userId, items: validItems || [] });
        } else {
            wishlist.items = validItems || [];
        }
        const updatedWishlist = await wishlist.save();
        res.json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;