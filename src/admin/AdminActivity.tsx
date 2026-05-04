import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_ACTIVITY } from './AdminDashboard';
import './AdminActivity.css';

const AdminActivity = () => {
    const navigate = useNavigate();
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [filterType, setFilterType] = useState('All Types');

    const closePortal = () => setSelectedActivity(null);

    const filteredActivities = INITIAL_ACTIVITY.filter(activity =>
        filterType === 'All Types' || activity.type.toLowerCase() === filterType.toLowerCase()
    );

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Activity Feed</h2>
                    <p className="page-subtitle">Detailed log of all recent system activities and events.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>
                        &larr; Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="admin-card activity-feed-card">
                <div className="activity-feed-header">
                    <h3>All Activities</h3>
                    <div className="activity-filters">
                        <select
                            className="form-select-sm"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All Types">All Types</option>
                            <option value="order">Orders</option>
                            <option value="customer">Customers</option>
                            <option value="product">Products</option>
                            <option value="review">Reviews</option>
                        </select>
                    </div>
                </div>

                <div className="activity-full-list">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map((activity) => (
                            <div key={activity.id} className="activity-feed-item">
                                <div className={`activity-status-indicator status-${activity.status}`}></div>
                                <div className="activity-details">
                                    <div className="activity-main">
                                        <span className="activity-type">{activity.type.toUpperCase()}</span>
                                        <p className="activity-msg">{activity.message}</p>
                                    </div>
                                    <div className="activity-meta">
                                        <span className="activity-time">{activity.time}</span>
                                        <span className="activity-id">ID: {activity.id}</span>
                                    </div>
                                </div>
                                <div className="activity-actions">
                                    <button
                                        className="btn-icon-sm"
                                        title="View Details"
                                        onClick={() => setSelectedActivity(activity)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-activities">
                            <p>No activities found for "{filterType}"</p>
                        </div>
                    )}

                    {/* Only show archived if showing All or System (logic placeholder) */}
                    {(filterType === 'All Types' || filterType === 'system') && [...Array(5)].map((_, i) => (
                        <div key={i} className="activity-feed-item archived">
                            <div className="activity-status-indicator status-completed"></div>
                            <div className="activity-details">
                                <div className="activity-main">
                                    <span className="activity-type">SYSTEM</span>
                                    <p className="activity-msg">Daily backup completed successfully</p>
                                </div>
                                <div className="activity-meta">
                                    <span className="activity-time">{i + 2} days ago</span>
                                    <span className="activity-id">ID: SYS-BK-00{i}</span>
                                </div>
                            </div>
                            <div className="activity-actions">
                                <button className="btn-icon-sm">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity Detail Modal */}
            {selectedActivity && (
                <div className="activity-modal-overlay" onClick={closePortal}>
                    <div className="activity-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="activity-modal-header">
                            <div className="activity-header-info">
                                <span className={`activity-type-badge ${selectedActivity.status}`}>
                                    {selectedActivity.type.toUpperCase()}
                                </span>
                                <h3>Activity Details</h3>
                            </div>
                            <button className="close-btn" onClick={closePortal}>&times;</button>
                        </div>
                        <div className="activity-modal-body">
                            <div className="detail-row">
                                <label>Activity ID</label>
                                <span>{selectedActivity.id}</span>
                            </div>
                            <div className="detail-row">
                                <label>Message</label>
                                <p className="msg-detail">{selectedActivity.message}</p>
                            </div>
                            <div className="detail-row">
                                <label>Time Occurred</label>
                                <span>{selectedActivity.time}</span>
                            </div>
                            <div className="detail-row">
                                <label>Priority Status</label>
                                <span className={`status-text ${selectedActivity.status}`}>
                                    {selectedActivity.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="detail-row">
                                <label>Action Source</label>
                                <span>{selectedActivity.id.startsWith('ACT') ? 'User Action' : 'System Event'}</span>
                            </div>
                        </div>
                        <div className="activity-modal-footer">
                            <button className="btn-secondary" onClick={closePortal}>Dismiss</button>
                            {selectedActivity.type === 'order' && (
                                <button className="btn-primary" onClick={() => navigate('/admin/orders')}>View Order</button>
                            )}
                            {selectedActivity.type === 'customer' && (
                                <button className="btn-primary" onClick={() => navigate('/admin/customers')}>View Customer</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminActivity;
