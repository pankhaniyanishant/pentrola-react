const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    orderItems: [{
        title: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'Stripe' },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: 'Pending' },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
