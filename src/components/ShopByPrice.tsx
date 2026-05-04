import { useNavigate } from 'react-router-dom';
import './ShopByPrice.css';

const ShopByPrice = () => {
    const navigate = useNavigate();

    const priceBlocks = [
        {
            id: 1,
            title: 'Under ₹500',
            description: 'Brushes, tapes & accessories',
            bgColor: '#2E9E8D', // Teal
            filter: '0-500'
        },
        {
            id: 2,
            title: '₹500 - ₹999',
            description: 'Paint sets & spray paints',
            bgColor: '#E65A2E', // Orange primary
            filter: '500-999'
        },
        {
            id: 3,
            title: '₹999 - ₹1999',
            description: 'Premium wall paints & kits',
            bgColor: '#1F2937', // Dark navy
            filter: '999-1999'
        },
        {
            id: 4,
            title: '₹2000+',
            description: 'Professional & bulk packs',
            bgColor: '#F59E0B', // Yellow/Amber
            filter: '2000-max'
        }
    ];

    const handlePriceClick = (filter: string) => {
        navigate(`/products?price=${filter}`);
    };

    return (
        <section className="shop-by-price-section">
            <div className="section-header center">
                <span className="section-subtitle">BUDGET FRIENDLY</span>
                <h2 className="section-title">Shop by Price</h2>
                <p className="section-desc">There's a perfect product for every budget</p>
            </div>

            <div className="price-blocks-grid">
                {priceBlocks.map((block) => (
                    <div
                        key={block.id}
                        className="price-block"
                        style={{ backgroundColor: block.bgColor, cursor: 'pointer' }}
                        onClick={() => handlePriceClick(block.filter)}
                    >
                        <h3 className="price-block-title">{block.title}</h3>
                        <p className="price-block-desc">{block.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ShopByPrice;
