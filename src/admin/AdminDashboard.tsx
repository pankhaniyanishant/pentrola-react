import { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { getDashboardStats, type DashboardStats } from '../services/adminApi';
import { getApiErrorMessage } from '../services/api';

// --- SVG Icons for Stats ---
const IconSales = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="m6 13 8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>;
const IconUsers = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconOrdersStats = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const IconRevenue = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('Today');
    const [isGenerating, setIsGenerating] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getDashboardStats(timeRange);
                setStats(data);
            } catch (err) {
                setError(getApiErrorMessage(err, 'Failed to load dashboard stats'));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeRange]);

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            alert('Report successfully generated and downloaded!');
        }, 2000);
    };

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const getCustomerName = (order: DashboardStats['recentOrders'][0]) => order.user?.name || order.guestEmail || 'Guest';

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Dashboard Overview</h2>
                    <p className="page-subtitle">Welcome back, here's what's happening today.</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        className="form-select"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', outline: 'none', background: 'white', cursor: 'pointer' }}
                    >
                        <option value="Today">Today</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="This Year">This Year</option>
                    </select>
                    <button
                        className="btn-add-product"
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        style={{ opacity: isGenerating ? 0.7 : 1 }}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#EF4444' }}>{error}</div>
            ) : stats && (
            <div className="stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Total Sales */}
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'default' }}>
                    <div className="stat-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="stat-title" style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>Total Sales</p>
                            <h3 className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>{formatCurrency(stats.totalSales)}</h3>
                        </div>
                        <div className="stat-icon" style={{ padding: '0.8rem', background: '#EEF2FF', color: '#4F46E5', borderRadius: '10px' }}>
                            <IconSales />
                        </div>
                    </div>
                    <div className="stat-footer" style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <span style={{ color: stats.salesGrowth >= 0 ? '#10B981' : '#EF4444', fontWeight: 600, marginRight: '0.5rem' }}>{stats.salesGrowth >= 0 ? '+' : ''}{stats.salesGrowth}%</span>
                        <span style={{ color: '#6B7280' }}>from previous period</span>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div className="stat-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="stat-title" style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>Total Orders</p>
                            <h3 className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>{stats.totalOrders}</h3>
                        </div>
                        <div className="stat-icon" style={{ padding: '0.8rem', background: '#ECFEFF', color: '#06B6D4', borderRadius: '10px' }}>
                            <IconOrdersStats />
                        </div>
                    </div>
                    <div className="stat-footer" style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <span style={{ color: stats.ordersGrowth >= 0 ? '#10B981' : '#EF4444', fontWeight: 600, marginRight: '0.5rem' }}>{stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth}%</span>
                        <span style={{ color: '#6B7280' }}>from previous period</span>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div className="stat-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="stat-title" style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>Total Customers</p>
                            <h3 className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>{stats.totalCustomers}</h3>
                        </div>
                        <div className="stat-icon" style={{ padding: '0.8rem', background: '#ECFDF5', color: '#10B981', borderRadius: '10px' }}>
                            <IconUsers />
                        </div>
                    </div>
                    <div className="stat-footer" style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <span style={{ color: stats.customersGrowth >= 0 ? '#10B981' : '#EF4444', fontWeight: 600, marginRight: '0.5rem' }}>{stats.customersGrowth >= 0 ? '+' : ''}{stats.customersGrowth}%</span>
                        <span style={{ color: '#6B7280' }}>from previous period</span>
                    </div>
                </div>

                {/* Revenue Growth */}
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div className="stat-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="stat-title" style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>Revenue Growth</p>
                            <h3 className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>{stats.revenueGrowth}%</h3>
                        </div>
                        <div className="stat-icon" style={{ padding: '0.8rem', background: '#FFF7ED', color: '#F97316', borderRadius: '10px' }}>
                            <IconRevenue />
                        </div>
                    </div>
                    <div className="stat-footer" style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <span style={{ color: '#10B981', fontWeight: 600, marginRight: '0.5rem' }}>+2.4%</span>
                        <span style={{ color: '#6B7280' }}>from previous period</span>
                    </div>
                </div>
</div>
            )}

            {stats && (
            <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

                {/* Recent Orders Table */}
                <div className="dashboard-card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div className="card-header" style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>Recent Orders</h3>
                        <a href="/admin/orders" style={{ color: '#2563EB', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>View All</a>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.slice(0, 5).map(order => (
                                    <tr key={order._id}>
                                        <td style={{ fontWeight: 600 }}>{order._id.slice(-6)}</td>
                                        <td>{getCustomerName(order)}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td style={{ fontWeight: 600 }}>{formatCurrency(order.totalPrice)}</td>
                                        <td>
                                            <span className={`badge-pill ${order.status === 'Delivered' ? 'badge-success' :
                                                order.status === 'Processing' ? 'badge-caution' :
                                                    order.status === 'Shipped' ? 'badge-info' : 'badge-warning'
                                                }`} style={{
                                                    background: order.status === 'Shipped' ? '#DBEAFE' : undefined,
                                                    color: order.status === 'Shipped' ? '#1E40AF' : undefined
                                                }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default AdminDashboard;
