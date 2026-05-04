const express = require('express');
const Wishlist = require('../models/Wishlist');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.params.userId });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.params.userId, items: [] });
        }
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:userId', async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.params.userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.params.userId, items: req.body.items || [] });
        } else {
            wishlist.items = req.body.items || [];
        }
        const updatedWishlist = await wishlist.save();
        res.json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;