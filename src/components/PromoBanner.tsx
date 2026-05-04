import { useNavigate } from 'react-router-dom';
import './PromoBanner.css';

const PromoBanner = () => {
    const navigate = useNavigate();

    return (
        <section className="promo-banner-section">
            <div className="promo-banner-content">
                <span className="promo-subtitle">PREMIUM COLLECTION</span>
                <h1 className="promo-title">
                    Award-Winning Paints<br />
                    Heart-Winning Color
                </h1>
                <p className="promo-desc">
                    Sustainability meets superior coverage. Our eco-friendly paints deliver
                    rich, lasting color while being kind to your home and the planet.
                </p>
                <div className="promo-actions">
                    <button className="promo-btn-primary" onClick={() => navigate('/products')}>
                        Shop the Collection
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                    <button className="promo-btn-secondary" onClick={() => navigate('/about')}>
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
