import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const resetPassword = async (email: string) => { console.log('Reset link sent to', email); return Promise.resolve(); };
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        try {
            await resetPassword(email);
            setStatus('success');
            setMessage('Password reset email sent! Please check your inbox.');
        } catch (err: unknown) {
            setStatus('error');
            const msg = (err as { message?: string })?.message || '';
            if (msg.includes('user-not-found') || msg.includes('invalid-email')) {
                setMessage('No account found with that email address.');
            } else {
                setMessage('Failed to send reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="image-section">
                <img src="/kids-playing.png" alt="Kids playing with a water gun in a park" className="hero-image" />
            </div>

            <div className="form-section">
                <header className="form-header">
                    <Link to="/signin" className="back-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                        Back to sign in
                    </Link>
                    <div className="brand">
                        <span className="brand-logo">P</span>
                        <span className="brand-name">Paintrola</span>
                    </div>
                </header>

                <div className="form-content">
                    <h1>Forgot Password</h1>
                    <p className="subtitle">
                        No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
                    </p>

                    {status === 'success' && (
                        <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                            {message}
                        </div>
                    )}
                    {status === 'error' && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                            {message}
                        </div>
                    )}

                    <form className="reset-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="mail-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
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

                        <button type="submit" className="submit-btn" disabled={loading || status === 'success'}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className="signin-prompt">
                        Remember your password? <Link to="/signin">Sign In</Link>
                    </p>
                </div>

                <footer className="form-footer">
                    Need help? Contact our <a href="#">Support Team</a>
                </footer>
            </div>
        </div>
    );
};

export default ForgotPassword;
