import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProducts, type Product } from '../services/adminApi';
import './Bestsellers.css';

const Bestsellers = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts(4);
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

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
                    <span className="section-subtitle">OUR PRODUCTS</span>
                    <h2 className="section-title">Products</h2>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', padding: '2rem 0' }}>
                    {[1,2,3,4].map(i => (
                        <div key={i} style={{ padding: '1rem', animation: 'pulse 1.5s infinite' }}>
                            <div style={{ height: '200px', background: '#E5E7EB', borderRadius: '8px', marginBottom: '1rem' }}></div>
                            <div style={{ height: '20px', background: '#E5E7EB', borderRadius: '4px', width: '80%' }}></div>
                            <div style={{ height: '16px', background: '#E5E7EB', borderRadius: '4px', width: '50%', marginTop: '8px' }}></div>
                        </div>
                    ))}
                </div>
            ) : (
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        <div className="product-image-container">
                            <img src={product.image || '/cat-toys.png'} alt={product.title} />

                            <div className="badges-top-left">
                                {product.stock === 0 && <span className="badge out-of-stock" style={{ backgroundColor: '#9CA3AF', color: 'white' }}>Out of Stock</span>}
                            </div>

                            <button
                                className={`favorite-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                                aria-label={isInWishlist(product._id) ? "Remove from favorites" : "Add to favorites"}
                                onClick={() => toggleWishlist({
                                    id: product._id,
                                    title: product.title,
                                    price: product.price,
                                    image: product.image || '',
                                    category: product.category || '',
                                    stock: product.stock
                                })}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={isInWishlist(product._id) ? "#E65A2E" : "none"} stroke={isInWishlist(product._id) ? "#E65A2E" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <div className="product-rating">
                                <div className="stars">
                                    {renderStars(4)}
                                </div>
                                <span className="review-count">(0)</span>
                            </div>
                            <div className="product-price">
                                <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
                            </div>
                            <button
                                className="add-to-cart-btn"
                                disabled={product.stock === 0}
                                onClick={() => {
                                    addToCart({
                                        id: product._id,
                                        title: product.title,
                                        price: product.price,
                                        image: product.image || '',
                                        category: product.category || '',
                                        stock: product.stock,
                                        quantity: 1
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
            )}
            <div className="view-all-container">
                <button className="view-all-btn" onClick={() => window.location.href = '/products'}>
                    View All Products
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default Bestsellers;
