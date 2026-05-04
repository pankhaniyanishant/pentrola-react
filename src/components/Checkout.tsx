import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
const placeOrder = async (orderData: any) => {
    const payload = {
        user: orderData.userId !== 'guest' ? orderData.userId : undefined,
        guestEmail: orderData.userId === 'guest' ? orderData.userEmail : undefined,
        orderItems: orderData.items.map((item: any) => ({
            title: item.title,
            qty: item.quantity,
            image: item.image,
            price: item.price,
            product: item.id
        })),
        shippingAddress: {
            address: orderData.address.address,
            city: orderData.address.city,
            postalCode: orderData.address.zipCode,
            country: orderData.address.state
        },
        paymentMethod: orderData.paymentMethod,
        itemsPrice: orderData.subtotal,
        taxPrice: 0,
        shippingPrice: orderData.shippingFee,
        totalPrice: orderData.grandTotal
    };

    const { data } = await api.post('/orders', payload);
    return data;
};
import Navbar from './Navbar';
import Footer from './Footer';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const shippingFee = cartTotal > 999 ? 0 : 99;
    const grandTotal = cartTotal + shippingFee;

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [orderLoading, setOrderLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderLoading(true);
        try {
            await placeOrder({
                userId: user?.uid || 'guest',
                userEmail: user?.email || formData.email,
                customerName: formData.fullName,
                items: cartItems,
                subtotal: cartTotal,
                shippingFee,
                grandTotal,
                address: formData,
                paymentMethod: 'Cash on Delivery'
            });
            clearCart();
            navigate('/order-success');
        } catch {
            alert('Failed to place order. Please try again.');
        } finally {
            setOrderLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <Navbar />
                <main className="checkout-empty">
                    <div className="empty-state-content">
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <button onClick={() => navigate('/products')} className="back-to-shop-btn">
                            Return to Shop
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <Navbar />
            <main className="checkout-main">
                <div className="checkout-header">
                    <h1>Secure Checkout</h1>
                </div>

                <div className="checkout-content">
                    {/* Left Column - Form */}
                    <div className="checkout-form-container">
                        <h2>Delivery Details</h2>
                        <form onSubmit={handleSubmit} className="checkout-form">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder=""
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Street Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    placeholder=""
                                ></textarea>
                            </div>

                            <div className="form-row three-cols">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        placeholder=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        placeholder=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="zipCode">ZIP Code</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        required
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            {/* Payment Method - Mock Visual */}
                            <div className="payment-method-section">
                                <h3>Payment Method</h3>
                                <div className="payment-option selected">
                                    <input type="radio" id="cod" name="payment" defaultChecked />
                                    <label htmlFor="cod">
                                        <div className="option-title">Cash on Delivery (COD)</div>
                                        <div className="option-desc">Pay when your order arrives</div>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="place-order-btn" disabled={orderLoading}>
                                {orderLoading ? 'Placing Order...' : `Buy Now - ₹${grandTotal.toLocaleString()}`}
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="order-summary-container">
                        <h2>Order Summary</h2>
                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="summary-item-img">
                                        <img src={item.image} alt={item.title} />
                                        <span className="summary-item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="summary-item-details">
                                        <h4>{item.title}</h4>
                                        {item.category && <span className="item-category">{item.category}</span>}
                                    </div>
                                    <div className="summary-item-price">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total to Pay</span>
                                <span>₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
