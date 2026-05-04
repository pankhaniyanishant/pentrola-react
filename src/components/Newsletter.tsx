import React, { useState } from 'react';
const subscribeNewsletter = async (email: string) => { console.log('Subscribed:', email); return Promise.resolve(); };
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await subscribeNewsletter(email);
            setStatus('success');
            setEmail('');
        } catch {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <h2 className="newsletter-title">Stay Inspired</h2>
                <p className="newsletter-desc">
                    Subscribe to get early access to new products, exclusive discounts, color trend guides and
                    painting tips delivered to your inbox.
                </p>

                {status === 'success' ? (
                    <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A', padding: '12px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 500 }}>
                        🎉 You're subscribed! Thanks for joining.
                    </div>
                ) : (
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="newsletter-input"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="newsletter-submit" disabled={loading}>
                            {loading ? (
                                <span>Subscribing...</span>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                    </svg>
                                    Subscribe
                                </>
                            )}
                        </button>
                    </form>
                )}

                {status === 'error' && (
                    <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '8px' }}>
                        Something went wrong. Please try again.
                    </p>
                )}

                <p className="newsletter-disclaimer">
                    No spam, unsubscribe anytime. We respect your privacy.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;
