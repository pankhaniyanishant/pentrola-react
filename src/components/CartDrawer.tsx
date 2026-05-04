import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer: React.FC = () => {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        toggleCart(); // Close the drawer
        navigate('/checkout'); // Navigate to checkout page
    }

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={toggleCart}></div>
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-cart-btn" onClick={toggleCart} aria-label="Close cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <p>Your cart is empty.</p>
                            <button className="continue-shopping-btn" onClick={toggleCart}>Continue Shopping</button>
                        </div>
                    ) : (
                        <ul className="cart-item-list">
                            {cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="cart-item-title-row">
                                            <h4 className="cart-item-title">{item.title}</h4>
                                            <button className="remove-item-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                                        <div className="cart-item-actions">
                                            <div className="quantity-controls">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-subtotal">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <p className="cart-taxes-notice">Taxes and shipping calculated at checkout.</p>
                        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
