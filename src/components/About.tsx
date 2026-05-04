import Navbar from './Navbar';
import Footer from './Footer';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />

            <main className="about-main">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="hero-content">
                        <span className="section-subtitle">OUR STORY</span>
                        <h1 className="hero-title">Crafting joy<br />Since 1998</h1>
                        <p className="hero-description">
                            What started as a small family-owned toy shop in Mumba
                            has grown into one of India's most trusted names in
                            pantrola toy supplies. For over 25 years, w've
                            been dedicated to bringing vibrant, lasting toy to ever
                            home, studio, and workspace.
                        </p>
                        <div className="hero-actions">
                            <button className="btn-primary">Shop Products</button>
                            <button className="btn-secondary">Get in Touch</button>
                        </div>
                    </div>
                    <div className="hero-image-container">
                        <img src="/kids-playing.png" alt="Happy kid playing with a toy xylophone" className="hero-main-image" />

                        {/* Overlay Badges replicating the image */}
                        <div className="badge-overlay top-left">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" /><path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /></svg>
                            </div>
                            <div className="badge-text">
                                <strong>No Mobile,</strong><br />No Screen Time
                            </div>
                        </div>

                        <div className="badge-overlay top-right">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" /></svg>
                            </div>
                            <div className="badge-text">
                                <strong>Phone-Like Activity</strong><br />Without Internet
                            </div>
                        </div>

                        <div className="badge-overlay middle-left">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zz" /></svg>
                            </div>
                            <div className="badge-text">
                                <strong>Keeps Kids</strong><br />Engaged Offline
                            </div>
                        </div>

                        <div className="badge-overlay middle-right">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" /><path fillRule="evenodd" d="M9 3v10H8V3h1z" /><path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z" /></svg>
                            </div>
                            <div className="badge-text">
                                <strong>Encourages Real</strong><br />Play & Learning
                            </div>
                        </div>

                        <div className="badge-overlay bottom-left primary">
                            <div className="badge-text highlighted">
                                <strong style={{ fontSize: '24px' }}>25+</strong><br />Years of Excellence
                            </div>
                        </div>

                        <div className="badge-overlay bottom-right">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.5 7.5A.5.5 0 0 1 9 8v5.5a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5z" /><path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5v.5H11v.5h-.5V1h-.5V.5h.5V0h.5v.122zM12.5 2.5A.5.5 0 0 1 13 3v1h1v.5h-1v1h-.5V4h-1v-.5h1V3a.5.5 0 0 1 .5-.5zm-9 1A.5.5 0 0 1 4 4v1h1v.5H4v1h-.5V5h-1v-.5h1V4a.5.5 0 0 1 .5-.5zM8.5 4A2.5 2.5 0 0 0 6 6.5v8a2.5 2.5 0 0 0 5 0v-8A2.5 2.5 0 0 0 8.5 4zM7 6.5A1.5 1.5 0 0 1 8.5 5 1.5 1.5 0 0 1 10 6.5v8A1.5 1.5 0 0 1 8.5 16 1.5 1.5 0 0 1 7 14.5v-8z" /></svg>
                            </div>
                            <div className="badge-text">
                                <strong>Music, Colors & Touch –</strong><br />Not a Screen
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="about-stats">
                    <div className="stat-item">
                        <div className="stat-number">25+</div>
                        <div className="stat-label">Years In Business</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Happy Customers</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Products Available</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">100+</div>
                        <div className="stat-label">Cities Served</div>
                    </div>
                </section>

                {/* Our Mission Section */}
                <section className="about-mission">
                    <div className="mission-image-container">
                        <img src="/kids-playing.png" alt="Happy kid playing with a toy" className="mission-image" />
                    </div>
                    <div className="mission-content">
                        <span className="section-subtitle">OUR MISSION</span>
                        <h2 className="mission-title">Bringing Color to Life with<br />Purpose</h2>
                        <p className="mission-description">
                            At Paintrola, we believe every stroke of color has the power to transform. Our mission is to provide premium, affordable art and paint supplies that inspire creativity and deliver professional-grade results for everyone — from first-time DIY enthusiasts to seasoned artists.
                        </p>

                        <div className="mission-features">
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
                                </div>
                                <div className="feature-text">
                                    <strong>Quality First</strong>
                                    <p>Every product undergoes rigorous quality testing to ensure brilliant, lasting color.</p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div className="feature-text">
                                    <strong>Trusted by Pros</strong>
                                    <p>Professional painters and artists across India rely on Paintrola for consistent results.</p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                                </div>
                                <div className="feature-text">
                                    <strong>Eco-Conscious</strong>
                                    <p>We use sustainable practices and low-VOC formulas to protect you and the environment.</p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                </div>
                                <div className="feature-text">
                                    <strong>Customer Care</strong>
                                    <p>Expert color consultants and dedicated support to guide you through every project.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Journey Section */}
                <section className="about-journey">
                    <div className="journey-content-container">
                        <span className="section-subtitle">OUR JOURNEY</span>
                        <h2 className="journey-title">From a Small Shop to a Trusted<br />Name</h2>
                        <p className="journey-description">
                            Our journey has been driven by a simple belief: everyone deserves access to high-quality paint and art supplies. Here are the milestones that shaped who we are today.
                        </p>

                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-year">1998</div>
                                <h3 className="timeline-title">The Beginning</h3>
                                <p className="timeline-text">Founded as a small paint shop in Dadar, Mumbai, serving local artists and homeowners.</p>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-year">2005</div>
                                <h3 className="timeline-title">Going National</h3>
                                <p className="timeline-text">Expanded operations to 10 cities across India with our first online storefront.</p>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-year">2015</div>
                                <h3 className="timeline-title">Premium Range Launch</h3>
                                <p className="timeline-text">Introduced our signature premium paint line with eco-friendly, low-VOC formulations.</p>
                            </div>

                            <div className="timeline-item active">
                                <div className="timeline-year">2023</div>
                                <h3 className="timeline-title">Art Supplies Hub</h3>
                                <p className="timeline-text">Became a one-stop destination with 500+ products including paints, brushes, canvas, and more.</p>
                            </div>
                        </div>
                    </div>

                    <div className="journey-image-container">
                        <img src="/kids-playing.png" alt="Family playing together" className="journey-image" />
                        <div className="sparkle-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="white" fillOpacity="0.8" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="about-team">
                    <div className="team-header">
                        <h2 className="team-title">The People Behind the Palette</h2>
                        <p className="team-description">
                            Meet the passionate team that works every day to bring you the best paints and art supplies from across the globe.
                        </p>
                    </div>

                    <div className="team-featured">
                        <img src="/kids-playing.png" alt="Our passionate team" className="team-featured-image" />
                    </div>

                    <div className="team-grid-container">
                        <div className="team-grid">
                            <div className="team-member-card">
                                <div className="member-avatar-placeholder"></div>
                                <h3 className="member-name">Sarah Jenkins</h3>
                                <p className="member-role">Founder & CEO</p>
                            </div>

                            <div className="team-member-card">
                                <div className="member-avatar-placeholder"></div>
                                <h3 className="member-name">Marcus Chen</h3>
                                <p className="member-role">Head of Product</p>
                            </div>

                            <div className="team-member-card">
                                <div className="member-avatar-placeholder"></div>
                                <h3 className="member-name">Priya Patel</h3>
                                <p className="member-role">Lead Color Specialist</p>
                            </div>

                            <div className="team-member-card">
                                <div className="member-avatar-placeholder"></div>
                                <h3 className="member-name">David O'Connor</h3>
                                <p className="member-role">Customer Experience</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="about-cta">
                    <div className="cta-content">
                        <h2>Ready to Bring Your Vision to Life?</h2>
                        <p>
                            Explore our curated collection of premium paints, brushes, and art supplies. Whether you're painting walls or creating art, we've got you covered.
                        </p>
                        <div className="cta-actions">
                            <button className="cta-btn-primary">
                                Browse Products
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                            <button className="cta-btn-secondary">Contact Us</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
