import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        // Generate a random mock order ID like "ORD-92847-ABC"
        const randomId = `ORD-${Math.floor(10000 + Math.random() * 90000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
        setOrderId(randomId);
    }, []);

    return (
        <div className="order-success-page">
            <Navbar />
            <main className="success-main">
                <div className="success-container">
                    <div className="success-icon-wrapper">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>

                    <h1>Order Placed Successfully!</h1>
                    <p className="success-message">
                        Thank you for your purchase. We've received your order and are getting it ready for shipment.
                    </p>

                    <div className="order-details-box">
                        <span className="order-label">Order Reference Number:</span>
                        <span className="order-number">{orderId}</span>
                    </div>

                    <div className="success-actions">
                        <button onClick={() => navigate('/products')} className="continue-btn">
                            Continue Shopping
                        </button>
                        <button onClick={() => navigate('/orders')} className="track-order-btn">
                            Track Order
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
