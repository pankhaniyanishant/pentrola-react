import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Bestsellers.css';

const Bestsellers = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const bestsellers = [
        {
            id: 1,
            title: 'Gun',
            price: '₹1,299',
            originalPrice: '₹1,599',
            rating: 4.5,
            reviews: 243,
            discount: '-19%',
            bestseller: true,
            image: '/kids-playing.png',
            stock: 12
        },
        {
            id: 2,
            title: 'Flip & match',
            price: '₹749',
            originalPrice: '₹999',
            rating: 4.0,
            reviews: 187,
            discount: '-25%',
            bestseller: true,
            image: '/educational-toys.png',
            stock: 0
        },
        {
            id: 3,
            title: 'Block',
            price: '₹899',
            originalPrice: '₹1,199',
            rating: 4.5,
            reviews: 312,
            discount: '-25%',
            bestseller: true,
            image: '/cat-toys.png',
            stock: 5
        },
        {
            id: 4,
            title: 'Sequence',
            price: '₹549',
            originalPrice: '₹699',
            rating: 4.0,
            reviews: 156,
            discount: null,
            bestseller: false,
            image: '/smart-sequence.png',
            stock: 20
        }
    ];

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg key={i} className={`star ${i <= rating ? 'filled' : i - 0.5 <= rating ? 'half' : 'empty'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <section className="bestsellers-section">
            <div className="section-header">
                <div>
                    <span className="section-subtitle">CROWD FAVORITES</span>
                    <h2 className="section-title">Bestsellers</h2>
                </div>
            </div>

            <div className="products-grid">
                {bestsellers.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-container">
                            <img src={product.image} alt={product.title} />

                            {/* Badges */}
                            <div className="badges-top-left">
                                {product.bestseller && <span className="badge bestseller-badge">Bestseller</span>}
                                {product.stock === 0 && <span className="badge out-of-stock" style={{ backgroundColor: '#9CA3AF', color: 'white' }}>Out of Stock</span>}
                            </div>
                            <div className="badges-top-right">
                                {product.discount && <span className="badge discount-badge">{product.discount}</span>}
                            </div>

                            {/* Favorite Button */}
                            <button
                                className={`favorite-btn ${isInWishlist(product.id + 100) ? 'active' : ''}`}
                                aria-label={isInWishlist(product.id + 100) ? "Remove from favorites" : "Add to favorites"}
                                onClick={() => toggleWishlist({
                                    id: product.id + 100,
                                    title: product.title,
                                    price: product.price,
                                    image: product.image
                                })}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={isInWishlist(product.id + 100) ? "#E65A2E" : "none"} stroke={isInWishlist(product.id + 100) ? "#E65A2E" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <div className="product-rating">
                                <div className="stars">
                                    {renderStars(product.rating)}
                                </div>
                                <span className="review-count">({product.reviews})</span>
                            </div>
                            <div className="product-price">
                                <span className="current-price">{product.price}</span>
                                {product.originalPrice && <span className="original-price">{product.originalPrice}</span>}
                            </div>
                            <button
                                className="add-to-cart-btn"
                                disabled={product.stock === 0}
                                onClick={() => {
                                    const priceNum = parseInt(product.price.replace(/[^\d]/g, ''), 10);
                                    addToCart({
                                        id: product.id + 100, // Unique ID for homepage items
                                        title: product.title,
                                        price: priceNum,
                                        image: product.image,
                                        quantity: 1,
                                        stock: product.stock
                                    });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    marginTop: '12px',
                                    backgroundColor: product.stock === 0 ? '#9CA3AF' : '#111827',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: '600',
                                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="view-all-container">
                <button className="view-all-btn" onClick={() => window.location.href = '/products'}>
                    View All Bestsellers
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default Bestsellers;
