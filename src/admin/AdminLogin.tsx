import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Mock Authentication Logic
        if (username === 'admin' && password === 'admin123') {
            // Success
            // In a real app, you would set a token in localStorage/cookies here
            login('admin@example.com', 'admin123');
            navigate('/admin/dashboard');
        } else {
            // Failure
            setError('Invalid username or password. Please try again.');
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
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

                    <button type="submit" className="btn-admin-login">Login</button>
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
