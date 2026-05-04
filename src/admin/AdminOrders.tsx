import { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { getAdminOrders, updateAdminOrderStatus, type AdminOrder } from '../services/adminApi';
import { getApiErrorMessage } from '../services/api';

const FilterPills = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];
const IconView = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconDate = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconLocation = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const AdminOrders = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getAdminOrders();
                setOrders(data);
                setError('');
            } catch (err) {
                setError(getApiErrorMessage(err, 'Failed to load orders'));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const displayedOrders = orders.filter((o) => {
        const matchesFilter = activeFilter === 'All' || o.status === activeFilter;
        const search = searchTerm.toLowerCase();
        const orderId = o._id.toLowerCase();
        const customerName = (o.user?.name || 'Guest').toLowerCase();
        const userEmail = (o.user?.email || o.guestEmail || 'guest@order').toLowerCase();
        return matchesFilter && (orderId.includes(search) || customerName.includes(search) || userEmail.includes(search));
    });

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'Delivered': return 'theme-success';
            case 'Shipped': return 'theme-purple';
            case 'Processing': return 'theme-info';
            case 'Pending': return 'theme-warning';
            default: return '';
        }
    };

    const handleUpdateStatus = async (status: string) => {
        if (!viewingOrder?._id) return;
        try {
            const updated = await updateAdminOrderStatus(viewingOrder._id, status);
            setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
            setViewingOrder(updated);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to update order status'));
        }
    };

    return (
        <div className="admin-content-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Orders</h2>
                    <p className="page-subtitle">View and manage customer orders</p>
                </div>
            </div>

            {error && <div className="empty-state" style={{ marginBottom: '12px', color: '#B91C1C' }}>{error}</div>}

            <div className="data-card bg-transparent shadow-none p-0">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="orders-filters" style={{ marginBottom: 0 }}>
                        {FilterPills.map((pill) => (
                            <button
                                key={pill}
                                className={`filter-pill ${activeFilter === pill ? 'active' : ''}`}
                                onClick={() => setActiveFilter(pill)}
                            >
                                {pill}
                            </button>
                        ))}
                    </div>
                    <div className="data-search-bar" style={{ maxWidth: '300px', margin: 0 }}>
                        <IconSearch />
                        <input
                            type="text"
                            placeholder="Search by ID, name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="orders-list">
                    {loading && <div className="empty-state">Loading orders...</div>}
                    {!loading && displayedOrders.map((order) => (
                        <div key={order._id} className={`order-card ${getStatusTheme(order.status)}`}>
                            <div className="order-card-header">
                                <div className="order-id-group">
                                    <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                                    <span className="order-status-badge">{order.status}</span>
                                </div>
                                <button className="btn-view-order" onClick={() => setViewingOrder(order)}>
                                    <IconView />
                                </button>
                            </div>

                            <div className="order-info-grid">
                                <div className="info-block">
                                    <span className="info-label">Customer</span>
                                    <span className="info-value">{order.user?.name || 'Guest User'}</span>
                                </div>
                                <div className="info-block">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{order.user?.email || order.guestEmail || 'N/A'}</span>
                                </div>
                                <div className="info-block">
                                    <span className="info-label">Items</span>
                                    <span className="info-value">{order.orderItems.length} items</span>
                                </div>
                                <div className="info-block">
                                    <span className="info-label">Total</span>
                                    <span className="info-value">₹{order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <div className="footer-item">
                                    <IconDate /> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div className="footer-item">
                                    <IconLocation /> {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.country || ''}
                                </div>
                            </div>
                        </div>
                    ))}

                    {!loading && displayedOrders.length === 0 && (
                        <div className="empty-state">No orders found matching your criteria.</div>
                    )}
                </div>
            </div>

            {viewingOrder && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Order Details: #{viewingOrder._id.slice(-8)}</h2>
                            <button className="btn-close-modal" onClick={() => setViewingOrder(null)}>×</button>
                        </div>

                        <div className="order-details-body" style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#6B7280' }}>Customer Information</h4>
                                    <p style={{ margin: 0, fontWeight: 600 }}>{viewingOrder.user?.name || 'Guest User'}</p>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4B5563' }}>{viewingOrder.user?.email || viewingOrder.guestEmail || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#6B7280' }}>Shipping Address</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.4 }}>
                                        {viewingOrder.shippingAddress?.address}, {viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.country} {viewingOrder.shippingAddress?.postalCode}
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#6B7280' }}>Items</h4>
                                {viewingOrder.orderItems.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '6px' }}>
                                        <span>{item.title} × {item.qty}</span>
                                        <strong>₹{(item.price * item.qty).toLocaleString()}</strong>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#6B7280' }}>Update Status</label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {FilterPills.filter((status) => status !== 'All').map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateStatus(status)}
                                                className={`filter-pill ${viewingOrder.status === status ? 'active' : ''}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                                    Total: ₹{viewingOrder.totalPrice.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
