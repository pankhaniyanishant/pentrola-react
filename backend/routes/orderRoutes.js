const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, user, userEmail, guestEmail } = req.body;

    try {
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        for (const item of orderItems) {
            try {
                const product = await Product.findById(item.id || item.product);
                if (product) {
                    product.stock = Math.max(0, product.stock - item.qty);
                    await product.save();
                }
            } catch (e) {
                console.log('Product not found for stock update:', item.id);
            }
        }

        const order = new Order({
            orderItems, user, userEmail, guestEmail, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice
        });

        const createdOrder = await order.save();

        if (user) {
            await Cart.findOneAndUpdate({ user }, { items: [] });
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        
        const ordersWithUserInfo = await Promise.all(orders.map(async (order) => {
            let customerName = 'Guest User';
            let customerEmail = order.guestEmail || 'N/A';
            
            if (order.user) {
                try {
                    const user = await User.findById(order.user);
                    if (user) {
                        customerName = user.name || 'Guest User';
                        customerEmail = user.email;
                    }
                } catch (e) {
                    console.log('User not found for order:', order._id);
                }
            }
            
            return {
                ...order.toObject(),
                customerName,
                customerEmail
            };
        }));
        
        res.json(ordersWithUserInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();
            
            let customerName = 'Guest User';
            let customerEmail = order.guestEmail || 'N/A';
            
            if (order.user) {
                try {
                    const user = await User.findById(order.user);
                    if (user) {
                        customerName = user.name || 'Guest User';
                        customerEmail = user.email;
                    }
                } catch (e) {
                    console.log('User not found for order:', order._id);
                }
            }
            
            res.json({
                ...updatedOrder.toObject(),
                customerName,
                customerEmail
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
