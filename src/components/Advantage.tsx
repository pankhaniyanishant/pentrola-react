import './Advantage.css';

const Advantage = () => {
    const advantages = [
        {
            id: 1,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
            ),
            title: 'Premium Quality',
            description: 'Curated selection of top-grade paints and supplies from trusted brands worldwide.',
            colorClass: 'icon-orange'
        },
        {
            id: 2,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
            ),
            title: 'Free & Fast Delivery',
            description: 'Complimentary shipping on orders above ₹999. Delivered to your doorstep within 3-5 days.',
            colorClass: 'icon-orange'
        },
        {
            id: 3,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
            ),
            title: 'Genuine Products',
            description: '100% authentic products with manufacturer warranty. No fakes, no compromises.',
            colorClass: 'icon-orange'
        },
        {
            id: 4,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
            ),
            title: 'Expert Support',
            description: 'Our color consultants are available to help you choose the perfect shades and finishes.',
            colorClass: 'icon-orange'
        }
    ];

    return (
        <section className="advantage-section">
            <div className="section-header center">
                <span className="section-subtitle">WHY CHOOSE US</span>
                <h2 className="section-title">The Paintrola Advantage</h2>
            </div>

            <div className="advantage-grid">
                {advantages.map((adv) => (
                    <div key={adv.id} className="advantage-card">
                        <div className={`advantage-icon ${adv.colorClass}`}>
                            {adv.icon}
                        </div>
                        <h3 className="advantage-title">{adv.title}</h3>
                        <p className="advantage-desc">{adv.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Advantage;
