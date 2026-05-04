import { useState, useEffect } from 'react';
export interface Order { id: string; status: string; customerName: string; userEmail: string; items: any[]; grandTotal: number; createdAt: any; address?: any; }
const getAllOrders = async (): Promise<Order[]> => { const orders = localStorage.getItem('orders'); return orders ? JSON.parse(orders) : []; };
const updateOrderStatus = async (id: string, status: string) => { const orders = await getAllOrders(); const updatedOrders = orders.map((o: Order) => o.id === id ? { ...o, status } : o); localStorage.setItem('orders', JSON.stringify(updatedOrders)); };
import './AdminDashboard.css';

const FilterPills = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

const IconView = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconDate = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconLocation = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    useEffect(() => {
        getAllOrders().then(data => {
            setOrders(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Filter and search logic
    const displayedOrders = orders.filter(o => {
        const matchesFilter = activeFilter === 'All' || o.status === activeFilter;
        const search = searchTerm.toLowerCase();
        const matchesSearch = (o.id || '').toLowerCase().includes(search) ||
            o.customerName.toLowerCase().includes(search) ||
            o.userEmail.toLowerCase().includes(search);
        return matchesFilter && matchesSearch;
    });

    // Dynamic styling based on status
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
        if (!viewingOrder?.id) return;
        await updateOrderStatus(viewingOrder.id, status as Order['status']);
        setOrders(orders.map(o => o.id === viewingOrder.id ? { ...o, status: status as Order['status'] } : o));
        setViewingOrder({ ...viewingOrder, status: status as Order['status'] });
    };

    return (
        <div className="admin-content-container">

            <div className="page-header">
                <div>
                    <h2 className="page-title">Orders</h2>
                    <p className="page-subtitle">View and manage customer orders</p>
                </div>
            </div>

            <div className="data-card bg-transparent shadow-none p-0">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="orders-filters" style={{ marginBottom: 0 }}>
                        {FilterPills.map(pill => (
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

                {/* Orders List */}
                <div className="orders-list">
                    {loading && <div className="empty-state">Loading orders...</div>}
                    {!loading && displayedOrders.map((order) => (
                        <div key={order.id} className={`order-card ${getStatusTheme(order.status)}`}>

                            <div className="order-card-header">
                                <div className="order-id-group">
                                    <h3 className="order-id">Order #{order.id}</h3>
                                    <span className="order-status-badge">{order.status}</span>
                                </div>
                                <button className="btn-view-order" onClick={() => setViewingOrder(order)}>
                                    <IconView />
                                </button>
                            </div>

                            <div className="order-info-grid">
                                <div className="info-block">
                                    <span className="info-label">Customer</span>
                                    <span className="info-value">{order.customerName}</span>
                                </div>
                                <div className="info-block">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{order.userEmail}</span>
                                </div>
                                <div className="info-block">
                                    <span className="info-label">Items</span>
                                    <span className="info-value">{order.items.length} items</span>
                                </div>
                                <div className="info-block">
                                    <span className="info-label">Total</span>
                                    <span className="info-value">₹{order.grandTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <div className="footer-item">
                                    <IconDate /> {(order.createdAt as { seconds?: number })?.seconds ? new Date(((order.createdAt as { seconds: number }).seconds) * 1000).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="footer-item">
                                    <IconLocation /> {order.address?.city || 'N/A'}, {order.address?.state || ''}
                                </div>
                            </div>

                        </div>
                    ))}

                    {!loading && displayedOrders.length === 0 && (
                        <div className="empty-state">No orders found matching your criteria.</div>
                    )}
                </div>

            </div>

            {/* View Order Modal */}
            {viewingOrder && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Order Details: #{viewingOrder.id}</h2>
                            <button className="btn-close-modal" onClick={() => setViewingOrder(null)}>×</button>
                        </div>

                        <div className="order-details-body" style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#6B7280' }}>Customer Information</h4>
                                    <p style={{ margin: 0, fontWeight: 600 }}>{viewingOrder.customerName}</p>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4B5563' }}>{viewingOrder.userEmail}</p>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#6B7280' }}>Shipping Address</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.4 }}>
                                        {viewingOrder.address?.address}, {viewingOrder.address?.city}, {viewingOrder.address?.state} {viewingOrder.address?.zipCode}
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#6B7280', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>Order Items</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {viewingOrder.items.map((item: any, idx: number) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={{ padding: '8px 0', fontSize: '0.875rem' }}>{item.title} <span style={{ color: '#9CA3AF' }}>x{item.quantity}</span></td>
                                                <td style={{ padding: '8px 0', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td style={{ padding: '12px 0', fontWeight: 700 }}>Total</td>
                                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>₹{viewingOrder.grandTotal?.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>Update Order Status</label>
                                <select
                                    className="form-select"
                                    value={viewingOrder.status}
                                    onChange={(e) => handleUpdateStatus(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions" style={{ padding: '15px 20px', background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
                            <button className="btn-save" style={{ width: '100%' }} onClick={() => setViewingOrder(null)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
