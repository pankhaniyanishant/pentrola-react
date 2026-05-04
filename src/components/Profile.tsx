import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn, updateProfile } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/signin');
            return;
        }

        setName(user?.displayName || '');
        setEmail(user?.email || '');
    }, [isLoggedIn, navigate, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password && password !== confirmPassword) {
            setError('Password and confirm password do not match.');
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({
                name,
                email,
                password: password || undefined,
            });
            setPassword('');
            setConfirmPassword('');
            setMessage('Profile updated successfully.');
        } catch (err) {
            const msg = (err as { message?: string }).message || 'Failed to update profile';
            setError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Navbar />
            <main style={{ maxWidth: '720px', margin: '32px auto', padding: '0 16px' }}>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px' }}>
                    <h1 style={{ marginTop: 0 }}>My Profile</h1>
                    <p style={{ color: '#6B7280', marginTop: 0 }}>Update your account details.</p>

                    {message && (
                        <div style={{ marginBottom: '12px', color: '#16A34A', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '10px 12px' }}>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div style={{ marginBottom: '12px', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px 12px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
                        <div>
                            <label htmlFor="profile-name" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-email" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Email</label>
                            <input
                                id="profile-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-password" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>New Password (optional)</label>
                            <input
                                id="profile-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-confirm-password" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Confirm New Password</label>
                            <input
                                id="profile-confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}
                                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            style={{ background: '#111827', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 14px', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                        >
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
