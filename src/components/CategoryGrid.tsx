import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryGrid.css';
import { getCategories, type ProductCategory } from '../services/adminApi';

const fallbackCategories = [
    { _id: 'INTERIOR TOY', count: 0 },
    { _id: 'BRUSHES & TOOLS', count: 0 },
    { _id: 'SPRAY PAINT', count: 0 },
    { _id: 'Top Rated', count: 0 },
];

const CategoryGrid = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<ProductCategory[]>(fallbackCategories);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const data = await getCategories();
                if (data && data.length > 0) {
                    setCategories(data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryTitle: string) => {
        navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
    };

    const categoryImages: Record<string, string> = {
        'INTERIOR TOY': '/cat-toys.png',
        'BRUSHES & TOOLS': '/educational-toys.png',
        'SPRAY PAINT': '/kids-playing.png',
        'Top Rated': '/smart-sequence.png',
    };

    return (
        <section className="category-section">
            <div className="section-header">
                <div>
                    <span className="section-subtitle">BROWSE COLLECTION</span>
                    <h2 className="section-title">Shop by Category</h2>
                </div>
                <button className="view-all-link" onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>
            </div>

            {loading ? (
                <div className="category-grid">
                    {[1,2,3,4].map(i => (
                        <div key={i} style={{ padding: '1rem', animation: 'pulse 1.5s infinite' }}>
                            <div style={{ height: '200px', background: '#E5E7EB', borderRadius: '8px', marginBottom: '1rem' }}></div>
                            <div style={{ height: '20px', background: '#E5E7EB', borderRadius: '4px', width: '80%' }}></div>
                        </div>
                    ))}
                </div>
            ) : (
            <div className="category-grid">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="category-image-container">
                            <img src={categoryImages[category._id] || '/cat-toys.png'} alt={category._id} />
                        </div>
                        <div className="category-info">
                            <h3 style={{ textTransform: 'uppercase' }}>{category._id}</h3>
                            <p>{category.count}+ Products</p>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </section>
    );
};

export default CategoryGrid;
