import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Products.css';
import './Bestsellers.css'; // Reusing grid and card CSS

const Products = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortOption, setSortOption] = useState('featured');

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            setActiveCategory(cat);
        }
    }, [searchParams]);
    const [initialProducts, setInitialProducts] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((p: any) => ({ ...p, id: p._id }));
                setInitialProducts(mapped);
            })
            .catch(console.error);
    }, []);

    const categories = ['All', ...Array.from(new Set(initialProducts.map(p => p.category)))];

    const filteredProducts = useMemo(() => {
        const priceFilter = searchParams.get('price');

        let result = initialProducts.filter(p => {
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesPrice = true;
            if (priceFilter) {
                const [min, max] = priceFilter.split('-').map(v => v === 'max' ? Infinity : parseInt(v));
                const priceNum = parseInt(p.price.replace(/[^\d]/g, ''));
                matchesPrice = priceNum >= min && priceNum <= max;
            }

            return matchesCategory && matchesSearch && matchesPrice;
        });

        if (sortOption === 'price-asc') {
            result.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, '')));
        } else if (sortOption === 'price-desc') {
            result.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, '')));
        } else if (sortOption === 'newest') {
            result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [searchTerm, activeCategory, sortOption, searchParams]);

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
        <div className="products-page">
            <Navbar />

            <main className="products-main">
                <div className="products-header">
                    <span className="section-subtitle">BROWSE COLLECTION</span>
                    <h1 className="section-title">All Products {searchParams.get('price') && `(Filtered by Price)`}</h1>
                    <p className="section-desc">
                        Discover our complete range of premium toys, tools, and art supplies. Quality you can trust for every project.
                    </p>
                </div>

                <div className="products-filters">
                    <div className="filters-top">
                        <div className="search-bar">
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filters-actions">
                            <span className="product-count">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z" />
                                    <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z" />
                                    <path fillRule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z" />
                                </svg>
                                {filteredProducts.length} products
                            </span>
                            <select
                                className="sort-dropdown"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                        </div>
                    </div>

                    <div className="categories-list">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="products-grid-container">
                    <div className="products-grid">
                        {filteredProducts.length === 0 ? (
                            <div className="no-products" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>
                                <h3>No products found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image-container">
                                        <img src={product.image} alt={product.title} />

                                        <div className="badges-top-left">
                                            {product.topRated && <span className="badge new-badge" style={{ backgroundColor: '#E65A2E', color: 'white' }}>Top Rated</span>}
                                            {product.stock === 0 && <span className="badge out-of-stock" style={{ backgroundColor: '#9CA3AF', color: 'white' }}>Out of Stock</span>}
                                            {product.stock > 0 && product.stock <= 8 && <span className="badge out-of-stock" style={{ backgroundColor: '#F59E0B', color: 'white' }}>Low Stock</span>}
                                        </div>

                                        {/* Favorite Button */}
                                        <button
                                            className={`favorite-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                            aria-label={isInWishlist(product.id) ? "Remove from favorites" : "Add to favorites"}
                                            onClick={() => toggleWishlist({
                                                id: product.id,
                                                title: product.title,
                                                price: product.price,
                                                image: product.image,
                                                category: product.category
                                            })}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={isInWishlist(product.id) ? "#E65A2E" : "none"} stroke={isInWishlist(product.id) ? "#E65A2E" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="product-info" style={{ textAlign: 'left' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.category}</span>
                                        <h3 className="product-title" style={{ marginTop: '2px', marginBottom: '4px' }}>{product.title}</h3>
                                        <div className="product-rating">
                                            <div className="stars">
                                                {renderStars(product.rating)}
                                            </div>
                                            <span className="current-price" style={{ fontSize: '13px', marginLeft: '2px' }}>{product.rating}</span>
                                            <span className="review-count">({product.reviews})</span>
                                        </div>
                                        <div className="product-price">
                                            <span className="current-price">{product.price}</span>
                                            <span className="original-price">{product.originalPrice}</span>
                                            {product.discount && <span style={{ color: '#E65A2E', fontSize: '12px', fontWeight: 'bold', marginLeft: '4px' }}>{product.discount}</span>}
                                        </div>
                                        <button
                                            className="add-to-cart-btn"
                                            disabled={product.stock === 0}
                                            onClick={() => {
                                                const priceNum = parseInt(product.price.replace(/[^\d]/g, ''), 10);
                                                addToCart({
                                                    id: product.id,
                                                    title: product.title,
                                                    price: priceNum,
                                                    image: product.image,
                                                    quantity: 1,
                                                    stock: product.stock
                                                });
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                marginTop: '12px',
                                                backgroundColor: product.stock === 0 ? '#9CA3AF' : '#111827',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                                transition: 'background-color 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (product.stock > 0) e.currentTarget.style.backgroundColor = '#374151';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (product.stock > 0) e.currentTarget.style.backgroundColor = '#111827';
                                            }}
                                        >
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Products;
