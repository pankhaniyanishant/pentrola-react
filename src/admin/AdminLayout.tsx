import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ACTIVITY } from './AdminDashboard';
import type { ReactNode } from 'react';
import './AdminDashboard.css';

// --- SVG Icons ---
const IconWebsite = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconDashboard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconProducts = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconOrders = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconCustomers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconInventory = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconAnalytics = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconLogout = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconBell = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><circle cx="18" cy="6" r="3" fill="#EF4444" stroke="none" /></svg>;

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    // Helper to determine if a route is active
    const isActive = (path: string) => location.pathname.startsWith(path);

    const toggleNotifications = () => setShowNotifications(!showNotifications);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar Navigator */}
            <aside className="admin-sidebar">
                <div className="admin-brand-area">
                    <div className="sidebar-logo">P</div>
                    <div className="sidebar-brand-text">
                        <span className="brand-title">PANTROLA</span>
                        <span className="brand-subtitle">Admin Panel</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to="/" style={{ color: '#E65A2E', fontWeight: 600 }}><IconWebsite /> Go to Website</Link>
                        </li>
                        <hr style={{ borderColor: '#374151', margin: '12px 0', opacity: 0.5 }} />
                        <li className={isActive('/admin/dashboard') ? 'active' : ''}>
                            <Link to="/admin/dashboard"><IconDashboard /> Dashboard</Link>
                        </li>
                        <li className={isActive('/admin/products') ? 'active' : ''}>
                            <Link to="/admin/products"><IconProducts /> Products</Link>
                        </li>
                        <li className={isActive('/admin/orders') ? 'active' : ''}>
                            <Link to="/admin/orders"><IconOrders /> Orders</Link>
                        </li>
                        <li className={isActive('/admin/customers') ? 'active' : ''}>
                            <Link to="/admin/customers"><IconCustomers /> Customers</Link>
                        </li>
                        <li className={isActive('/admin/inventory') ? 'active' : ''}>
                            <Link to="/admin/inventory"><IconInventory /> Inventory</Link>
                        </li>
                        <li className={isActive('/admin/analytics') ? 'active' : ''}>
                            <Link to="/admin/analytics"><IconAnalytics /> Analytics</Link>
                        </li>
                        <li className={isActive('/admin/settings') ? 'active' : ''}>
                            <Link to="/admin/settings"><IconSettings /> Settings</Link>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="btn-logout" onClick={handleLogout}>
                        <IconLogout /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {/* Top Header */}
                <header className="admin-header">
                    <h1 className="header-title">Admin Dashboard</h1>

                    <div className="header-profile-area">
                        <div style={{ position: 'relative' }}>
                            <button className="btn-icon" onClick={toggleNotifications}>
                                <IconBell />
                            </button>

                            {showNotifications && (
                                <div className="notifications-dropdown">
                                    <div className="dropdown-header">
                                        <h3>Notifications</h3>
                                        <button className="btn-text-sm" onClick={() => navigate('/admin/activity')}>View All</button>
                                    </div>
                                    <div className="dropdown-body">
                                        {INITIAL_ACTIVITY.slice(0, 5).map(activity => (
                                            <div key={activity.id} className="notification-item" onClick={() => {
                                                setShowNotifications(false);
                                                navigate('/admin/activity');
                                            }}>
                                                <div className={`notification-dot ${activity.status}`}></div>
                                                <div className="notification-content">
                                                    <p className="notification-msg">{activity.message}</p>
                                                    <span className="notification-time">{activity.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="dropdown-footer">
                                        <Link to="/admin/activity" onClick={() => setShowNotifications(false)}>Clear all notifications</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">Sufiyan</span>
                                <span className="user-role">Administrator</span>
                            </div>
                            <div className="user-avatar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content injected here */}
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
