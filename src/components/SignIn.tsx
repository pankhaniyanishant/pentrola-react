import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignIn.css';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message || 'Sign in failed';
            if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
                setError('Invalid email or password. Please try again.');
            } else if (msg.includes('too-many-requests')) {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('Sign in failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="image-section">
                <img
                    src="/smart-sequence.png"
                    alt="Smart Sequence Board Game"
                    className="hero-image"
                />
            </div>

            <div className="form-section">
                <header className="form-header">
                    <Link to="/" className="back-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                        Back to store
                    </Link>
                    <div className="brand">
                        <span className="brand-logo">P</span>
                        <span className="brand-name">Pantrola</span>
                    </div>
                </header>

                <div className="form-content">
                    <h1>Welcome Back</h1>
                    <p className="subtitle">
                        Sign in to access your account, track orders, and explore our latest collections.
                    </p>

                    {error && (
                        <div style={{
                            background: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            marginBottom: '16px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form className="signin-form" onSubmit={handleSignIn}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                                </svg>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="password-header">
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#E65A2E', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</Link>
                            </div>
                            <div className="input-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    aria-label="Toggle password visibility"
                                    onClick={() => setShowPassword(p => !p)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <button type="button" className="social-btn google-btn" onClick={() => navigate('/')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>

                    <p className="signup-prompt">
                        Don't have an account? <Link to="/signup">Create Account</Link>
                    </p>
                </div>

                <footer className="form-footer">
                    By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </footer>
            </div>
        </div>
    );
};

export default SignIn;
