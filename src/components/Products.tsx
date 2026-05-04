import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import './Products.css';
import './Bestsellers.css';

interface Product {
    _id: string;
    id: string;
    title: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    stock: number;
}

const formatInr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const normalizeProduct = (raw: Partial<Product> & { _id?: string }) => ({
    _id: raw._id || '',
    id: raw._id || '',
    title: raw.title || 'Untitled Product',
    category: raw.category || 'Uncategorized',
    price: Number(raw.price) || 0,
    originalPrice: raw.originalPrice ? Number(raw.originalPrice) : undefined,
    image: raw.image || '/hero-sequence.png',
    stock: Number(raw.stock) || 0,
});

const Products = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('featured');
    const [initialProducts, setInitialProducts] = useState<Product[]>([]);
    const activeCategory = searchParams.get('category') || 'All';

    useEffect(() => {
        api.get('/products')
            .then(({ data }) => {
                const mapped = (Array.isArray(data) ? data : []).map((item) => normalizeProduct(item as Partial<Product> & { _id?: string }));
                setInitialProducts(mapped);
            })
            .catch(console.error);
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(initialProducts.map((p) => p.category).filter(Boolean)));
        return ['All', ...uniqueCategories];
    }, [initialProducts]);

    const filteredProducts = useMemo(() => {
        const priceFilter = searchParams.get('price');

        let result = initialProducts.filter((p) => {
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesPrice = true;
            if (priceFilter) {
                const [minStr, maxStr] = priceFilter.split('-');
                const min = Number(minStr) || 0;
                const max = maxStr === 'max' ? Number.POSITIVE_INFINITY : Number(maxStr) || Number.POSITIVE_INFINITY;
                matchesPrice = p.price >= min && p.price <= max;
            }

            return matchesCategory && matchesSearch && matchesPrice;
        });

        if (sortOption === 'price-asc') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortOption === 'newest') {
            result = [...result].sort((a, b) => b.id.localeCompare(a.id));
        }

        return result;
    }, [initialProducts, searchTerm, activeCategory, sortOption, searchParams]);

    return (
        <div className="products-page">
            <Navbar />

            <main className="products-main">
                <div className="products-header">
                    <span className="section-subtitle">BROWSE COLLECTION</span>
                    <h1 className="section-title">All Products {searchParams.get('price') && '(Filtered by Price)'}</h1>
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
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => {
                                    const nextParams = new URLSearchParams(searchParams);
                                    if (cat === 'All') {
                                        nextParams.delete('category');
                                    } else {
                                        nextParams.set('category', cat);
                                    }
                                    setSearchParams(nextParams);
                                }}
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
                                            {product.stock === 0 && <span className="badge out-of-stock" style={{ backgroundColor: '#9CA3AF', color: 'white' }}>Out of Stock</span>}
                                            {product.stock > 0 && product.stock <= 8 && <span className="badge out-of-stock" style={{ backgroundColor: '#F59E0B', color: 'white' }}>Low Stock</span>}
                                        </div>

                                        <button
                                            className={`favorite-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                            aria-label={isInWishlist(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                                            onClick={() => toggleWishlist({
                                                id: product.id,
                                                title: product.title,
                                                price: product.price,
                                                image: product.image,
                                                category: product.category,
                                                stock: product.stock,
                                            })}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={isInWishlist(product.id) ? '#E65A2E' : 'none'} stroke={isInWishlist(product.id) ? '#E65A2E' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="product-info" style={{ textAlign: 'left' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.category}</span>
                                        <h3 className="product-title" style={{ marginTop: '2px', marginBottom: '4px' }}>{product.title}</h3>
                                        <div className="product-price">
                                            <span className="current-price">{formatInr(product.price)}</span>
                                            {product.originalPrice && <span className="original-price">{formatInr(product.originalPrice)}</span>}
                                        </div>
                                        <button
                                            className="add-to-cart-btn"
                                            disabled={product.stock === 0}
                                            onClick={() => {
                                                addToCart({
                                                    id: product.id,
                                                    title: product.title,
                                                    price: product.price,
                                                    image: product.image,
                                                    quantity: 1,
                                                    stock: product.stock,
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
