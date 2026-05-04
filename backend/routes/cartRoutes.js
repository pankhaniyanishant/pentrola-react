const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
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
        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new Cart({ user: req.params.userId, items: req.body.items });
        } else {
            cart.items = req.body.items;
        }
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
