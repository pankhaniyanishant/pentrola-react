import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const sendContactMessage = async (data: any) => { console.log('Message sent', data); return Promise.resolve(); };
import './Contact.css';

const Contact = () => {
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formLoading, setFormLoading] = useState(false);

    const toggleFaq = (id: number) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await sendContactMessage(formData);
            setFormStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        } catch {
            setFormStatus('error');
        } finally {
            setFormLoading(false);
        }
    };

    const faqs = [
        {
            id: 1,
            question: "Do you offer free color consultation?",
            answer: "Yes, our expert color consultants are available to help you choose the perfect palette for your space. You can book an appointment online or walk into our store."
        },
        {
            id: 2,
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy on unopened and undamaged products. Custom tinted paints, unfortunately, cannot be returned."
        },
        {
            id: 3,
            question: "Do you deliver outside Mumbai?",
            answer: "Yes, we ship our premium paints and supplies across all major cities in India. Shipping costs are calculated at checkout based on your location and order size."
        },
        {
            id: 4,
            question: "Can I place a bulk order for my project?",
            answer: "Absolutely! We offer special pricing for bulk orders tailored to contractors, designers, and large-scale projects. Please contact our bulk orders team for a custom quote."
        }
    ];

    return (
        <div className="contact-page">
            <Navbar />

            <main className="contact-main">
                {/* Hero Section */}
                <section className="contact-hero">
                    <div className="hero-content">
                        <span className="section-subtitle">CONTACT US</span>
                        <h1 className="hero-title">We'd Love to<br />Hear From You</h1>
                        <p className="hero-description">
                            Whether you need help choosing the perfect shade, have a bulk order inquiry, or simply want to say hello — our team is here to assist you.
                        </p>
                    </div>
                </section>

                {/* Split Layout Section */}
                <section className="contact-details">
                    <div className="contact-container">

                        {/* Form Section */}
                        <div className="contact-form-section">
                            <h2 className="section-heading">Send Us a Message</h2>
                            <p className="section-subheading">Fill out the form below and we'll respond as soon as possible</p>

                            {formStatus === 'success' ? (
                                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A', padding: '16px 20px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, textAlign: 'center', marginTop: '16px' }}>
                                    ✅ Your message was sent! We'll get back to you soon.
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleContactSubmit}>
                                    {formStatus === 'error' && (
                                        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}>
                                            Failed to send. Please try again.
                                        </div>
                                    )}
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input type="text" id="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="Rajesh" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input type="text" id="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Mehta" required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" value={formData.email} onChange={handleFormChange} placeholder="rajesh.mehta@example.com" required />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject">Subject</label>
                                        <input type="text" id="subject" value={formData.subject} onChange={handleFormChange} placeholder="How can we help?" required />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Message</label>
                                        <textarea id="message" value={formData.message} onChange={handleFormChange} rows={5} placeholder="Type your message here..." required></textarea>
                                    </div>

                                    <button type="submit" className="btn-submit" disabled={formLoading}>
                                        {formLoading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Information Section */}
                        <div className="contact-info-section">
                            <h2 className="section-heading">Contact Information</h2>
                            <p className="section-subheading">Reach out through any of these channels. We're always happy to help.</p>

                            <div className="info-cards">
                                <div className="info-card">
                                    <div className="card-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <div className="card-content">
                                        <h3>Phone</h3>
                                        <p>+91 98765 43210</p>
                                        <p>+91 22 2634 5678</p>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <div className="card-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    </div>
                                    <div className="card-content">
                                        <h3>Email</h3>
                                        <p>hello@paintrola.com</p>
                                        <p>support@paintrola.com</p>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <div className="card-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    </div>
                                    <div className="card-content">
                                        <h3>Office</h3>
                                        <p>123 Creative Hub, Andheri East,</p>
                                        <p>Mumbai, Maharashtra 400069</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Visit Our Store Section */}
                <section className="contact-store">
                    <div className="store-header">
                        <h2>Visit Our Store</h2>
                        <p>Come see our full range of paints and art supplies in person. Our expert staff is ready to help you find exactly what you need.</p>
                    </div>

                    <div className="store-image-container">
                        {/* Using placeholder image since a specific store image wasn't provided, adjust as needed */}
                        <img src="/kids-playing.png" alt="Inside Paintrola Store" className="store-main-image" />

                        {/* Overlay Card */}
                        <div className="store-info-card">
                            <h3>Paintrola Store</h3>
                            <p className="store-address">123, Paint Street, Andheri West</p>
                            <p className="store-city">Mumbai, Maharashtra - 400058</p>
                            <button className="btn-directions">Get Directions</button>
                        </div>

                        {/* Carousel Navigation Placeholder */}
                        <div className="carousel-nav">
                            <button className="carousel-btn prev" aria-label="Previous image">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <button className="carousel-btn next" aria-label="Next image">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="contact-faq">
                    <div className="faq-header">
                        <span className="section-subtitle">FAQ</span>
                        <h2>Frequently Asked Questions</h2>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq) => (
                            <div key={faq.id} className={`faq-item ${openFaqId === faq.id ? 'active' : ''}`}>
                                <button
                                    className="faq-question"
                                    onClick={() => toggleFaq(faq.id)}
                                    aria-expanded={openFaqId === faq.id}
                                >
                                    {faq.question}
                                    <svg
                                        className="faq-icon"
                                        width="20" height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <div
                                    className="faq-answer-wrapper"
                                    style={{
                                        maxHeight: openFaqId === faq.id ? '200px' : '0',
                                        opacity: openFaqId === faq.id ? 1 : 0,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
