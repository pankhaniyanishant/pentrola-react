import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import './Wishlist.css';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price: any) => {
        if (typeof price === 'number') return price;
        // Remove everything except digits and decimal point
        const sanitized = String(price).replace(/[^0-9.]/g, '');
        const val = parseFloat(sanitized);
        return isNaN(val) ? 0 : val;
    };

    return (
        <div className="wishlist-page">
            <Navbar />
            <main className="wishlist-main">
                <div className="wishlist-container">
                    <header className="wishlist-header">
                        <h1>My Wishlist</h1>
                        <p>{wishlistItems.length} items saved to your list</p>
                    </header>

                    {wishlistItems.length === 0 ? (
                        <div className="wishlist-empty">
                            <div className="empty-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <h2>Your wishlist is empty</h2>
                            <p>Save items that you like in your wishlist, review them anytime and easily move them to the cart.</p>
                            <button onClick={() => navigate('/products')} className="shop-now-btn">
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="wishlist-grid">
                            {wishlistItems.map((item: any) => (
                                <div key={item.id} className="wishlist-card">
                                    <div className="wishlist-card-image">
                                        <img src={item.image} alt={item.title} />
                                        <button
                                            className="remove-wishlist-btn"
                                            onClick={() => removeFromWishlist(item.id)}
                                            aria-label="Remove from wishlist"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="wishlist-card-content">
                                        <div className="item-info">
                                            {item.category && <span className="item-category">{item.category}</span>}
                                            <h3>{item.title}</h3>
                                            <div className="item-price">₹{formatPrice(item.price).toLocaleString()}</div>
                                        </div>
                                        <div className="wishlist-card-actions">
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => {
                                                    addToCart({
                                                        id: item.id as number,
                                                        title: item.title,
                                                        price: formatPrice(item.price),
                                                        image: item.image,
                                                        quantity: 1
                                                    });
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;
