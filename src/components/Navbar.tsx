import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
    const { cartCount, toggleCart } = useCart();
    const { isLoggedIn, logout } = useAuth();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const toggleProfile = () => setShowProfileDropdown(!showProfileDropdown);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="navbar-container">
            {/* Main Navigation */}
            <nav className="main-nav">
                <div className="nav-brand">
                    <div className="brand-logo">P</div>
                    <span className="brand-text">PANTROLA</span>
                </div>

                <ul className="nav-links">
                    <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
                    <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Products</NavLink></li>
                    <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink></li>
                    <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
                    {isLoggedIn && <li><NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>Orders</NavLink></li>}
                </ul>

                <div className="nav-actions">
                    <button className="icon-btn cart-toggle-btn" aria-label="Cart" onClick={toggleCart}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    <button className="icon-btn wishlist-btn" aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
                    </button>
                    {!isLoggedIn && (
                        <NavLink to="/signin" className="icon-btn" aria-label="Profile" title="Sign In">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </NavLink>
                    )}
                    {/* Link to Admin Panel */}
                    <NavLink to="/admin/login" className="icon-btn" aria-label="Admin Panel" title="Admin Panel">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="9"></rect>
                            <rect x="14" y="3" width="7" height="5"></rect>
                            <rect x="14" y="12" width="7" height="9"></rect>
                            <rect x="3" y="16" width="7" height="5"></rect>
                        </svg>
                    </NavLink>
                    {isLoggedIn && (
                        <div className="nav-profile-container" style={{ position: 'relative' }}>
                            <button className="nav-user-btn" onClick={toggleProfile} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', transition: 'background 0.2s' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563' }}>Hi, Sufiyan</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showProfileDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>

                            {showProfileDropdown && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-user-header">
                                        <div className="user-avatar-sm">SF</div>
                                        <div className="user-details-sm">
                                            <span className="user-name-sm">Sufiyan</span>
                                            <span className="user-email-sm">sufiyan@example.com</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <ul className="dropdown-menu-list">
                                        <li onClick={() => { navigate('/orders'); setShowProfileDropdown(false); }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                            My Orders
                                        </li>
                                        <li onClick={() => { navigate('/wishlist'); setShowProfileDropdown(false); }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                            Wishlist
                                        </li>
                                        <li className="logout-li" onClick={handleLogout}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
