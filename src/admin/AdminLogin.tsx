import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, logout, isLoggedIn, isAdmin, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isLoggedIn && isAdmin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isLoading, isLoggedIn, isAdmin, navigate]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const loggedInUser = await login(email, password);
            if (!loggedInUser.isAdmin) {
                await logout();
                setError('This account does not have admin access.');
                return;
            }
            navigate('/admin/dashboard');
        } catch {
            setError('Invalid username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">

                <div className="admin-logo-container">
                    <div className="brand-logo admin-brand-logo">P</div>
                    <div className="admin-brand-text-block">
                        <span className="brand-text admin-brand-text">PANTROLA</span>
                        <span className="admin-subtitle">Admin Portal</span>
                    </div>
                </div>

                <h1 className="admin-login-title">Admin Login</h1>

                <form onSubmit={handleLogin} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="username">Email</label>
                        <input
                            type="email"
                            id="username"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="admin-login-error">{error}</div>}

                    <button type="submit" className="btn-admin-login" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <button onClick={() => navigate('/')} className="btn-back-store">
                        Back to Store
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
