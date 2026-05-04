import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const SLIDES = [
    {
        id: 1,
        title: 'Discover the Joy of Play',
        subtitle: 'Premium toys for every stage of childhood.',
        image: '/hero-xylophone.png'
    },
    {
        id: 2,
        title: 'Explore Creative Worlds',
        subtitle: 'Educational toys to spark imagination and growth.',
        image: '/kids-playing.png'
    }
];

const Hero = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[currentSlide];

    return (
        <div className="hero-container">
            <div className="hero-image-wrapper">
                <img src={slide.image} alt={slide.title} className="hero-banner-image" />

                <div className="hero-overlay-content">
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                    <button className="hero-cta-btn" onClick={() => navigate('/products')}>
                        Shop Now
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '8px' }}>
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                </div>

                {/* Carousel Controls */}
                <button className="carousel-btn prev-btn" aria-label="Previous slide" onClick={prevSlide}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </button>
                <button className="carousel-btn next-btn" aria-label="Next slide" onClick={nextSlide}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>

                {/* Carousel Dots */}
                <div className="carousel-indicators">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${currentSlide === index ? 'active' : ''}`}
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => setCurrentSlide(index)}
                        ></button>
                    ))}
                </div>
            </div>

            <div className="breadcrumb">
                <span className="dot-red"></span>
                <span className="breadcrumb-text">Toy For kids</span>
            </div>
        </div>
    );
};

export default Hero;
