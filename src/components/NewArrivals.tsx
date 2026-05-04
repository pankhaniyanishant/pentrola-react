import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Bestsellers.css'; // Reusing Bestsellers CSS for the grid layout to maintain consistency

const NewArrivals = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    // Reusing the same data structure, but modifying tags and images for demonstration
    const newArrivals = [
        {
            id: 1,
            title: 'Xylophone',
            price: '₹349',
            originalPrice: '₹449',
            rating: 4.0,
            reviews: 67,
            discount: '-22%',
            isNew: true,
            image: '/hero-xylophone.png',
            stock: 10
        },
        {
            id: 2,
            title: 'Launcher Bike',
            price: '₹499',
            originalPrice: '₹599',
            rating: 4.5,
            reviews: 42,
            discount: null,
            isNew: false,
            image: '/educational-toys.png',
            stock: 3
        },
        {
            id: 3,
            title: 'Rainbowball',
            price: '₹899',
            originalPrice: '₹1,199',
            rating: 4.0,
            reviews: 312,
            discount: '-25%',
            isNew: true,
            image: '/kids-playing.png',
            stock: 0
        },
        {
            id: 4,
            title: 'Block',
            price: '₹549',
            originalPrice: '₹699',
            rating: 4.5,
            reviews: 156,
            discount: null,
            isNew: false,
            image: '/cat-toys.png',
            stock: 15
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
        <section className="bestsellers-section" style={{ backgroundColor: '#FFFFFF' }}> {/* Overriding background to white for this section */}
            <div className="section-header">
                <div>
                    <span className="section-subtitle">JUST LANDED</span>
                    <h2 className="section-title">New Arrivals</h2>
                </div>
                <a href="/products" className="view-all-link">
                    Shop More
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </a>
            </div>

            <div className="products-grid">
                {newArrivals.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-container">
                            <img src={product.image} alt={product.title} />

                            {/* Badges */}
                            <div className="badges-top-left">
                                {product.isNew && <span className="badge new-badge" style={{ backgroundColor: '#E65A2E', color: 'white' }}>New</span>}
                                {product.stock === 0 && <span className="badge out-of-stock" style={{ backgroundColor: '#9CA3AF', color: 'white' }}>Out of Stock</span>}
                            </div>
                            <div className="badges-top-right">
                                {product.discount && <span className="badge discount-badge">{product.discount}</span>}
                            </div>

                            {/* Favorite Button */}
                            <button
                                className={`favorite-btn ${isInWishlist(product.id + 200) ? 'active' : ''}`}
                                aria-label={isInWishlist(product.id + 200) ? "Remove from favorites" : "Add to favorites"}
                                onClick={() => toggleWishlist({
                                    id: product.id + 200,
                                    title: product.title,
                                    price: product.price,
                                    image: product.image
                                })}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={isInWishlist(product.id + 200) ? "#E65A2E" : "none"} stroke={isInWishlist(product.id + 200) ? "#E65A2E" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                                        id: product.id + 200, // Unique ID for homepage items
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
        </section>
    );
};

export default NewArrivals;
