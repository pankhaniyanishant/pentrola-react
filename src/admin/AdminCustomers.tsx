import { useEffect, useMemo, useState, type FormEvent } from 'react';
import './AdminDashboard.css';
import {
    createAdminUser,
    deleteAdminUser,
    getAdminOrders,
    getAdminUsers,
    updateAdminUser,
    type AdminUser,
} from '../services/adminApi';
import { getApiErrorMessage } from '../services/api';

const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconDelete = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconView = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

type CustomerForm = {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
};

const INITIAL_FORM: CustomerForm = {
    name: '',
    email: '',
    password: '',
    isAdmin: false,
};

const AdminCustomers = () => {
    const [customers, setCustomers] = useState<AdminUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
    const [viewingCustomer, setViewingCustomer] = useState<AdminUser | null>(null);
    const [newCustomer, setNewCustomer] = useState<CustomerForm>(INITIAL_FORM);
    const [orderSummary, setOrderSummary] = useState<Record<string, { count: number; total: number }>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [users, orders] = await Promise.all([getAdminUsers(), getAdminOrders()]);
            setCustomers(users);

            const summary = orders.reduce<Record<string, { count: number; total: number }>>((acc, order) => {
                const userId = order.user;
                if (!userId) return acc;
                const current = acc[userId] || { count: 0, total: 0 };
                acc[userId] = { count: current.count + 1, total: current.total + order.totalPrice };
                return acc;
            }, {});
            setOrderSummary(summary);
            setError('');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to load customers'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredCustomers = useMemo(
        () => customers
            .filter((customer) => !customer.isAdmin)
            .filter((customer) =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [customers, searchTerm]
    );

    const resetForm = () => {
        setNewCustomer(INITIAL_FORM);
        setEditingCustomerId(null);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (editingCustomerId) {
                const updated = await updateAdminUser(editingCustomerId, {
                    name: newCustomer.name,
                    email: newCustomer.email,
                    isAdmin: newCustomer.isAdmin,
                    password: newCustomer.password || undefined,
                });
                setCustomers((prev) => prev.map((c) => (c._id === editingCustomerId ? updated : c)));
            } else {
                const created = await createAdminUser({
                    name: newCustomer.name,
                    email: newCustomer.email,
                    password: newCustomer.password,
                    isAdmin: newCustomer.isAdmin,
                });
                setCustomers((prev) => [created, ...prev]);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to save customer'));
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (customer: AdminUser) => {
        setNewCustomer({
            name: customer.name,
            email: customer.email,
            password: '',
            isAdmin: customer.isAdmin,
        });
        setEditingCustomerId(customer._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this customer account?')) return;
        try {
            await deleteAdminUser(id);
            setCustomers((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to delete customer'));
        }
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Orders', 'Spent', 'Joined Date'];
        const csvRows = customers
            .filter((customer) => !customer.isAdmin)
            .map((customer) => {
                const stats = orderSummary[customer._id] || { count: 0, total: 0 };
                return [
                    customer._id,
                    `"${customer.name}"`,
                    `"${customer.email}"`,
                    stats.count,
                    stats.total.toFixed(2),
                    customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : '',
                ];
            });
        const csvContent = [headers.join(','), ...csvRows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'customers_export.csv');
        link.click();
    };

    return (
        <div className="admin-content-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Customers</h2>
                    <p className="page-subtitle">Manage your registered store accounts</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-save" onClick={handleExportCSV} style={{ background: '#F3F4F6', color: '#374151' }}>
                        Export CSV
                    </button>
                    <button className="btn-add-product" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                        + Add Customer
                    </button>
                </div>
            </div>

            {error && <div className="empty-state" style={{ marginBottom: '12px', color: '#B91C1C' }}>{error}</div>}

            <div className="data-card">
                <div className="data-search-bar">
                    <IconSearch />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="empty-state" style={{ margin: '20px' }}>Loading customers...</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Role</th>
                                    <th>Total Orders</th>
                                    <th>Total Spent</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => {
                                    const avatar = customer.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                                    const stats = orderSummary[customer._id] || { count: 0, total: 0 };
                                    const active = stats.count > 0 || customer.isAdmin;
                                    return (
                                        <tr key={customer._id}>
                                            <td>
                                                <div className="customer-cell-container">
                                                    <div className="customer-avatar-circle">{avatar}</div>
                                                    <div className="customer-cell-info">
                                                        <span className="customer-name">{customer.name}</span>
                                                        <span className="customer-email">{customer.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-secondary">{customer.isAdmin ? 'Admin' : 'Customer'}</td>
                                            <td className="fw-600">{stats.count}</td>
                                            <td className="fw-600">₹{stats.total.toFixed(2)}</td>
                                            <td className="text-secondary">{new Date(customer.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge-pill ${active ? 'badge-success' : 'badge-warning'}`}>
                                                    {active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-action" title="View Profile" onClick={() => setViewingCustomer(customer)}><IconView /></button>
                                                    <button className="btn-action" title="Edit" onClick={() => handleEdit(customer)}><IconEdit /></button>
                                                    <button className="btn-action" title="Delete" onClick={() => handleDelete(customer._id)}><IconDelete /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {!loading && filteredCustomers.length === 0 && (
                        <div className="empty-state" style={{ margin: '20px' }}>
                            No customers found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingCustomerId ? 'Edit Customer' : 'Add Customer'}</h2>
                            <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSave} className="add-product-form">
                            <div className="form-grid">
                                <div className="form-group span-2">
                                    <label>Full Name*</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label>Email*</label>
                                    <input
                                        type="email"
                                        required
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label>Password{editingCustomerId ? ' (optional)' : '*'}</label>
                                    <input
                                        type="password"
                                        required={!editingCustomerId}
                                        minLength={8}
                                        value={newCustomer.password}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newCustomer.isAdmin}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, isAdmin: e.target.checked })}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Grant admin access
                                    </label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? 'Saving...' : (editingCustomerId ? 'Update Customer' : 'Create Customer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewingCustomer && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Customer Profile</h2>
                            <button className="btn-close-modal" onClick={() => setViewingCustomer(null)}>×</button>
                        </div>
                        <div style={{ padding: '20px', display: 'grid', gap: '12px' }}>
                            <div><strong>Name:</strong> {viewingCustomer.name}</div>
                            <div><strong>Email:</strong> {viewingCustomer.email}</div>
                            <div><strong>Role:</strong> {viewingCustomer.isAdmin ? 'Admin' : 'Customer'}</div>
                            <div><strong>Joined:</strong> {new Date(viewingCustomer.createdAt).toLocaleString()}</div>
                            <div><strong>Total Orders:</strong> {orderSummary[viewingCustomer._id]?.count || 0}</div>
                            <div><strong>Total Spent:</strong> ₹{(orderSummary[viewingCustomer._id]?.total || 0).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
