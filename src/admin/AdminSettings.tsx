import { useState } from 'react';
import './AdminDashboard.css';

// SVG Icons
const IconSave = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const IconLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconBell = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconGlobe = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    // Mock settings state
    const [settings, setSettings] = useState({
        storeName: 'Pantrola Store',
        storeEmail: 'contact@pantrola.com',
        currency: 'INR',
        taxRate: 18,
        notifications: {
            orders: true,
            lowStock: true,
            newCustomers: false
        },
        security: {
            twoFactor: false
        }
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 800);
    };

    return (
        <div className="admin-content-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Settings</h2>
                    <p className="page-subtitle">Configure your store preferences and system parameters</p>
                </div>
                <button
                    className="btn-add-product"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ background: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px', justifyContent: 'center' }}
                >
                    {isSaving ? (
                        <>Saving...</>
                    ) : (
                        <><IconSave /> Save Changes</>
                    )}
                </button>
            </div>

            <div className="data-card" style={{ display: 'flex', padding: 0, overflow: 'hidden', minHeight: '600px', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                {/* Settings Sidebar Tabs */}
                <div style={{ width: '260px', background: '#F9FAFB', borderRight: '1px solid #E5E7EB', padding: '1.5rem 0' }}>
                    {[
                        { id: 'general', label: 'General', icon: <IconGlobe /> },
                        { id: 'notifications', label: 'Notifications', icon: <IconBell /> },
                        { id: 'security', label: 'Security', icon: <IconLock /> }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '1rem 1.5rem',
                                cursor: 'pointer',
                                background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                                color: activeTab === tab.id ? '#4F46E5' : '#6B7280',
                                fontWeight: activeTab === tab.id ? 700 : 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderRight: activeTab === tab.id ? '3px solid #4F46E5' : '3px solid transparent',
                                borderBottom: '1px solid #F3F4F6',
                                fontSize: '0.9375rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </div>
                    ))}
                </div>

                {/* Settings Form Content */}
                <div style={{ flex: 1, padding: '2.5rem', background: 'white' }}>
                    {activeTab === 'general' && (
                        <div style={{ maxWidth: '650px' }}>
                            <div style={{ borderBottom: '1px solid #F3F4F6', marginBottom: '2rem', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>General Settings</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Manage your store identity and regional preferences.</p>
                            </div>

                            <div className="form-grid" style={{ gap: '1.5rem' }}>
                                <div className="form-group span-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Store Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={settings.storeName}
                                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9375rem' }}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Support Email</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={settings.storeEmail}
                                        onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9375rem' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Store Currency</label>
                                    <select
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9375rem', background: 'white' }}
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    >
                                        <option value="INR">Indian Rupee (₹)</option>
                                        <option value="USD">US Dollar ($)</option>
                                        <option value="EUR">Euro (€)</option>
                                        <option value="GBP">British Pound (£)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        value={settings.taxRate}
                                        onChange={(e) => setSettings({ ...settings, taxRate: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9375rem' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div style={{ maxWidth: '650px' }}>
                            <div style={{ borderBottom: '1px solid #F3F4F6', marginBottom: '2rem', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>Notification Preferences</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Choose how you want to be alerted about store activities.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { id: 'orders', label: 'New Order Alerts', desc: 'Get notified via email and dashboard when a customer places a new order' },
                                    { id: 'lowStock', label: 'Low Stock Alerts', desc: 'Receive notifications when products fall below your set threshold' },
                                    { id: 'newCustomers', label: 'New Registrations', desc: 'Get alerted whenever a new customer creates an account' }
                                ].map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', border: '1px solid #F3F4F6', borderRadius: '12px', background: '#FAFBFC' }}>
                                        <div style={{ flex: 1, paddingRight: '20px' }}>
                                            <p style={{ fontWeight: 700, margin: '0 0 2px 0', color: '#374151', fontSize: '0.9375rem' }}>{item.label}</p>
                                            <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>{item.desc}</p>
                                        </div>
                                        <div
                                            onClick={() => setSettings({ ...settings, notifications: { ...settings.notifications, [item.id]: !settings.notifications[item.id as keyof typeof settings.notifications] } })}
                                            style={{
                                                width: '44px',
                                                height: '24px',
                                                borderRadius: '12px',
                                                background: settings.notifications[item.id as keyof typeof settings.notifications] ? '#10B981' : '#E5E7EB',
                                                position: 'relative',
                                                cursor: 'pointer',
                                                transition: 'background 0.3s'
                                            }}
                                        >
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                background: 'white',
                                                position: 'absolute',
                                                top: '3px',
                                                left: settings.notifications[item.id as keyof typeof settings.notifications] ? '23px' : '3px',
                                                transition: 'left 0.3s'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={{ maxWidth: '650px' }}>
                            <div style={{ borderBottom: '1px solid #F3F4F6', marginBottom: '2rem', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>Security & Access</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Manage your password and authentication methods.</p>
                            </div>

                            <div style={{ marginBottom: '2.5rem', padding: '1.5rem', border: '1px solid #F3F4F6', borderRadius: '12px', background: '#FAFBFC' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1, paddingRight: '20px' }}>
                                        <p style={{ fontWeight: 700, margin: '0 0 2px 0', color: '#374151', fontSize: '0.9375rem' }}>Two-Factor Authentication</p>
                                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Add an extra layer of security to your admin account with TOTP.</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, security: { ...settings.security, twoFactor: !settings.security.twoFactor } })}
                                        style={{
                                            padding: '0.625rem 1.25rem',
                                            borderRadius: '8px',
                                            background: settings.security.twoFactor ? '#FEE2E2' : '#EFF6FF',
                                            color: settings.security.twoFactor ? '#EF4444' : '#2563EB',
                                            border: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {settings.security.twoFactor ? 'Disable Enable' : 'Set Up 2FA'}
                                    </button>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#111827' }}>Update Admin Password</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Current Password</label>
                                    <input type="password" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9375rem' }} placeholder="••••••••" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>New Password</label>
                                        <input type="password" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9375rem' }} placeholder="••••••••" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Confirm New Password</label>
                                        <input type="password" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9375rem' }} placeholder="••••••••" />
                                    </div>
                                </div>
                                <button style={{ width: 'max-content', padding: '0.875rem 2rem', marginTop: '0.5rem', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', color: '#374151', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
