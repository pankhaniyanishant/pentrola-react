import { useNavigate } from 'react-router-dom';
import './CategoryGrid.css';

const CategoryGrid = () => {
    const navigate = useNavigate();

    const categories = [
        { id: 1, title: 'INTERIOR TOY', count: '120+ Products', image: '/cat-toys.png' },
        { id: 2, title: 'BRUSHES & TOOLS', count: '85+ Products', image: '/educational-toys.png' },
        { id: 3, title: 'SPRAY PAINT', count: '60+ Products', image: '/kids-playing.png' },
        { id: 4, title: 'Top Rated', count: '200+ Products', image: '/smart-sequence.png' },
    ];

    const handleCategoryClick = (categoryTitle: string) => {
        navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
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

            <div className="category-grid">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category.title)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="category-image-container">
                            <img src={category.image} alt={category.title} />
                        </div>
                        <div className="category-info">
                            <h3 style={{ textTransform: 'uppercase' }}>{category.title}</h3>
                            <p>{category.count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
