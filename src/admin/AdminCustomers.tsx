import { useState, type FormEvent } from 'react';
import './AdminDashboard.css';

// SVG Icons
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconDelete = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconView = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

// Mock Database Data
const INITIAL_CUSTOMERS = [
    { id: 1, name: "Sufiyan", email: "sufiyan@email.com", phone: "+91 98765 43210", orders: 12, spent: 456.89, joined: "2023-11-04", status: "Active", avatar: "SF" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 (555) 987-6543", orders: 3, spent: 154.67, joined: "2024-01-15", status: "Active", avatar: "SJ" },
    { id: 3, name: "Michael Chen", email: "m.chen@email.com", phone: "+1 (555) 456-7890", orders: 8, spent: 890.30, joined: "2023-08-22", status: "Inactive", avatar: "MC" },
    { id: 4, name: "Emily Davis", email: "emilydavis88@email.com", phone: "+1 (555) 222-3333", orders: 1, spent: 29.99, joined: "2024-02-28", status: "Active", avatar: "ED" },
    { id: 5, name: "Robert Wilson", email: "r.wilson_tech@email.com", phone: "+1 (555) 777-8888", orders: 0, spent: 0.00, joined: "2024-03-01", status: "Inactive", avatar: "RW" },
];

const AdminCustomers = () => {
    const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
    const [viewingCustomer, setViewingCustomer] = useState<any>(null);

    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'Active'
    });

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        if (editingCustomerId !== null) {
            setCustomers(customers.map(c => c.id === editingCustomerId ? {
                ...c,
                name: newCustomer.name,
                email: newCustomer.email,
                phone: newCustomer.phone,
                status: newCustomer.status,
                avatar: newCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            } : c));
        } else {
            const customerToAdd = {
                id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
                name: newCustomer.name,
                email: newCustomer.email,
                phone: newCustomer.phone,
                orders: 0,
                spent: 0,
                joined: new Date().toISOString().split('T')[0],
                status: newCustomer.status,
                avatar: newCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            };
            setCustomers([customerToAdd, ...customers]);
        }
        setIsModalOpen(false);
        resetForm();
    };

    const handleEdit = (customer: any) => {
        setNewCustomer({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            status: customer.status
        });
        setEditingCustomerId(customer.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to remove this customer account?")) {
            setCustomers(customers.filter(c => c.id !== id));
        }
    };

    const resetForm = () => {
        setNewCustomer({ name: '', email: '', phone: '', status: 'Active' });
        setEditingCustomerId(null);
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Orders", "Spent", "Joined Date", "Status"];
        const csvRows = customers.map(customer => [
            customer.id,
            `"${customer.name}"`,
            `"${customer.email}"`,
            `"${customer.phone}"`,
            customer.orders,
            customer.spent.toFixed(2),
            customer.joined,
            `"${customer.status}"`
        ]);
        const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `customers_export.csv`);
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
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Total Orders</th>
                                <th>Total Spent</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div className="customer-cell-container">
                                            <div className="customer-avatar-circle">{customer.avatar}</div>
                                            <div className="customer-cell-info">
                                                <span className="customer-name">{customer.name}</span>
                                                <span className="customer-email">{customer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-secondary">{customer.phone}</td>
                                    <td className="fw-600">{customer.orders}</td>
                                    <td className="fw-600">₹{customer.spent.toFixed(2)}</td>
                                    <td className="text-secondary">{customer.joined}</td>
                                    <td>
                                        <span className={`badge-pill ${customer.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action" title="View Profile" onClick={() => setViewingCustomer(customer)}><IconView /></button>
                                            <button className="btn-action" title="Edit" onClick={() => handleEdit(customer)}><IconEdit /></button>
                                            <button className="btn-action" title="Delete" onClick={() => handleDelete(customer.id)}><IconDelete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCustomers.length === 0 && (
                        <div className="empty-state" style={{ margin: '20px' }}>
                            No customers found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingCustomerId !== null ? 'Edit Customer' : 'Add New Customer'}</h2>
                            <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSave} className="add-product-form">
                            <div className="form-grid">
                                <div className="form-group span-2">
                                    <label>Full Name*</label>
                                    <input type="text" required value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} placeholder="" />
                                </div>
                                <div className="form-group span-2">
                                    <label>Email Address*</label>
                                    <input type="email" required value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label>Account Status</label>
                                    <select value={newCustomer.status} onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">{editingCustomerId !== null ? 'Update Customer' : 'Save Customer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewingCustomer && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h2>Customer Profile</h2>
                            <button className="btn-close-modal" onClick={() => setViewingCustomer(null)}>×</button>
                        </div>
                        <div style={{ padding: '24px', textAlign: 'center' }}>
                            <div className="customer-avatar-circle" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 16px' }}>{viewingCustomer.avatar}</div>
                            <h3 style={{ margin: '0 0 4px 0' }}>{viewingCustomer.name}</h3>
                            <p style={{ color: '#6B7280', margin: '0 0 24px 0' }}>{viewingCustomer.email}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left', background: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Orders</p>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>{viewingCustomer.orders}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Spent</p>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>₹{viewingCustomer.spent.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Phone</p>
                                    <p style={{ margin: 0, fontSize: '0.875rem' }}>{viewingCustomer.phone}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Joined</p>
                                    <p style={{ margin: 0, fontSize: '0.875rem' }}>{viewingCustomer.joined}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions" style={{ padding: '15px 24px', background: '#F9FAFB' }}>
                            <button className="btn-save" style={{ width: '100%' }} onClick={() => setViewingCustomer(null)}>Close Profile</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
