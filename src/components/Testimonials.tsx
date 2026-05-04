import './Testimonials.css';

const Testimonials = () => {
    const reviews = [
        {
            id: 1,
            quote: "Absolutely love the wall paints from Paintrola! The matte finish turned out exactly as shown. The color consultancy service was so helpful.",
            rating: 5,
            product: "Royal Matte Finish - Ivory White",
            author: "Priya Sharma",
            location: "Mumbai"
        },
        {
            id: 2,
            quote: "Best art supply store online. The acrylic paint set has incredible pigmentation. Fast delivery and great packaging too.",
            rating: 5,
            product: "Acrylic Paint Set - 24 Colors",
            author: "Rahul Verma",
            location: "Delhi"
        },
        {
            id: 3,
            quote: "Great selection of brushes and rollers. The professional kit was worth every rupee. Will definitely order again for my next project.",
            rating: 4,
            product: "Professional Brush Set - 12 Piece",
            author: "Anita Desai",
            location: "Bangalore"
        }
    ];

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <section className="testimonials-section">
            <div className="section-header center">
                <span className="section-subtitle">CUSTOMER LOVE</span>
                <h2 className="section-title">What Our Customers Say</h2>
            </div>

            <div className="testimonials-grid">
                {reviews.map((review) => (
                    <div key={review.id} className="testimonial-card">
                        <div className="quote-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                        </div>
                        <p className="quote-text">"{review.quote}"</p>

                        <div className="review-meta">
                            <div className="stars">
                                {renderStars(review.rating)}
                            </div>
                            <p className="purchased-item">Purchased: {review.product}</p>
                        </div>

                        <div className="author-info">
                            <p className="author-name">{review.author}</p>
                            <p className="author-location">{review.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
