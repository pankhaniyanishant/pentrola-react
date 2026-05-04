import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';
import './AdminDashboard.css';

const IconSave = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconBell = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconGlobe = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

const AdminSettings = () => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [profile, setProfile] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
    });

    const [settings, setSettings] = useState({
        storeName: 'Pantrola Store',
        storeEmail: 'contact@pantrola.com',
        currency: 'INR',
        taxRate: 18,
        notifications: {
            orders: true,
            lowStock: true,
            newCustomers: false,
        },
        security: {
            twoFactor: false,
        },
    });

    const roleLabel = useMemo(() => (user?.isAdmin ? 'Administrator' : 'User'), [user?.isAdmin]);

    const handleSave = async () => {
        setMessage('');
        setError('');
        setIsSaving(true);

        try {
            if (activeTab === 'profile') {
                if (profile.password && profile.password !== profile.confirmPassword) {
                    setError('Password and confirm password do not match.');
                    return;
                }

                await updateProfile({
                    name: profile.name,
                    email: profile.email,
                    password: profile.password || undefined,
                });

                setProfile((prev) => ({ ...prev, password: '', confirmPassword: '' }));
                setMessage('Profile updated successfully.');
            } else {
                setMessage('Settings saved successfully.');
            }
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to save settings'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-content-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Settings</h2>
                    <p className="page-subtitle">Configure admin profile and store preferences</p>
                </div>
                <button
                    className="btn-add-product"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ background: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px', justifyContent: 'center' }}
                >
                    {isSaving ? 'Saving...' : <><IconSave /> Save Changes</>}
                </button>
            </div>

            {message && <div className="empty-state" style={{ marginBottom: '12px', color: '#166534' }}>{message}</div>}
            {error && <div className="empty-state" style={{ marginBottom: '12px', color: '#B91C1C' }}>{error}</div>}

            <div className="data-card" style={{ display: 'flex', padding: 0, overflow: 'hidden', minHeight: '600px', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                <div style={{ width: '260px', background: '#F9FAFB', borderRight: '1px solid #E5E7EB', padding: '1.5rem 0' }}>
                    {[
                        { id: 'profile', label: 'Profile', icon: <IconUser /> },
                        { id: 'general', label: 'General', icon: <IconGlobe /> },
                        { id: 'notifications', label: 'Notifications', icon: <IconBell /> },
                        { id: 'security', label: 'Security', icon: <IconLock /> },
                    ].map((tab) => (
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
                            }}
                        >
                            {tab.icon} {tab.label}
                        </div>
                    ))}
                </div>

                <div style={{ flex: 1, padding: '2.5rem', background: 'white' }}>
                    {activeTab === 'profile' && (
                        <div style={{ maxWidth: '650px' }}>
                            <div style={{ borderBottom: '1px solid #F3F4F6', marginBottom: '2rem', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>Admin Profile</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Update your name, email, and password.</p>
                            </div>

                            <div className="form-grid" style={{ gap: '1.5rem' }}>
                                <div className="form-group span-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Role</label>
                                    <input value={roleLabel} disabled style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#F9FAFB' }} />
                                </div>
                                <div className="form-group span-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>New Password</label>
                                    <input
                                        type="password"
                                        minLength={8}
                                        value={profile.password}
                                        onChange={(e) => setProfile((prev) => ({ ...prev, password: e.target.value }))}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Confirm Password</label>
                                    <input
                                        type="password"
                                        minLength={8}
                                        value={profile.confirmPassword}
                                        onChange={(e) => setProfile((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div style={{ maxWidth: '650px' }}>
                            <div style={{ borderBottom: '1px solid #F3F4F6', marginBottom: '2rem', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>General Settings</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Manage your store identity and regional preferences.</p>
                            </div>

                            <div className="form-grid" style={{ gap: '1.5rem' }}>
                                <div className="form-group span-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Store Name</label>
                                    <input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
                                </div>
                                <div className="form-group span-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Support Email</label>
                                    <input type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Store Currency</label>
                                    <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white' }}>
                                        <option value="INR">Indian Rupee (₹)</option>
                                        <option value="USD">US Dollar ($)</option>
                                        <option value="EUR">Euro (€)</option>
                                        <option value="GBP">British Pound (£)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Tax Rate (%)</label>
                                    <input type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: parseInt(e.target.value || '0', 10) })} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div style={{ maxWidth: '650px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Notification Preferences</h3>
                            {[
                                { id: 'orders', label: 'New Order Alerts' },
                                { id: 'lowStock', label: 'Low Stock Alerts' },
                                { id: 'newCustomers', label: 'New Customer Alerts' },
                            ].map((item) => (
                                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications[item.id as keyof typeof settings.notifications]}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, [item.id]: e.target.checked },
                                        })}
                                    />
                                    {item.label}
                                </label>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={{ maxWidth: '650px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Security</h3>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.security.twoFactor}
                                    onChange={(e) => setSettings({ ...settings, security: { twoFactor: e.target.checked } })}
                                />
                                Enable Two-Factor Authentication
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
