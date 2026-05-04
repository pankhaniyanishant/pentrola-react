const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            cart = await Cart.create({ user: req.params.userId, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:userId', async (req, res) => {
    try {
        const { items } = req.body;
        
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid items data' });
        }
        
        for (const item of items) {
            try {
                const itemId = item.id;
                // Only validate stock if the id looks like a valid MongoDB ObjectId
                if (itemId && mongoose.Types.ObjectId.isValid(itemId)) {
                    const product = await Product.findById(itemId);
                    if (product) {
                        const currentQty = item.quantity || 1;
                        if (currentQty > product.stock) {
                            return res.status(400).json({ 
                                message: `Only ${product.stock} items available in stock for "${product.title}"`,
                                maxStock: product.stock,
                                itemId: item.id
                            });
                        }
                    }
                }
            } catch (e) {
                // Product not found by _id, skip validation
            }
        }

        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new Cart({ user: req.params.userId, items: items || [] });
        } else {
            cart.items = items;
        }
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
