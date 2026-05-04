import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import './AdminDashboard.css';

// --- SVG Icons Components ---
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconDelete = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

// Mock Product Data
const MOCK_PRODUCTS = [
    { id: 1, name: "Wooden Blocks Set", category: "Building Toys", price: 29.99, cost: 12.00, stock: 45, profit: "60.0%", rating: "4.8 (124)", image: "/hero-sequence.png" },
    { id: 2, name: "Remote Control Car", category: "Remote Control", price: 45.99, cost: 18.50, stock: 32, profit: "59.8%", rating: "4.5 (89)", image: "/hero-xylophone.png" },
    { id: 3, name: "Puzzle Collection", category: "Puzzles", price: 19.99, cost: 8.00, stock: 78, profit: "60.0%", rating: "4.6 (156)", image: "/smart-sequence.png" },
    { id: 4, name: "Action Figures Pack", category: "Action Figures", price: 34.99, cost: 14.00, stock: 12, profit: "60.0%", rating: "4.3 (67)", image: "/kids-playing.png" },
    { id: 5, name: "LEGO City Set", category: "Building Toys", price: 59.99, cost: 28.00, stock: 24, profit: "53.3%", rating: "4.9 (203)", image: "/cat-toys.png" },
];

const AdminProducts = () => {
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Building Toys',
        price: '',
        cost: '',
        stock: '',
        image: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSubmit = (e: FormEvent) => {
        e.preventDefault();

        const priceNum = parseFloat(newProduct.price) || 0;
        const costNum = parseFloat(newProduct.cost) || 0;
        const profitMargin = priceNum > 0 ? (((priceNum - costNum) / priceNum) * 100).toFixed(1) + '%' : '0.0%';

        if (editingProductId !== null) {
            setProducts(products.map(p => p.id === editingProductId ? {
                ...p,
                name: newProduct.name,
                category: newProduct.category,
                price: priceNum,
                cost: costNum,
                stock: parseInt(newProduct.stock) || 0,
                profit: profitMargin,
                image: newProduct.image
            } : p));
        } else {
            const productToAdd = {
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                name: newProduct.name,
                category: newProduct.category,
                price: priceNum,
                cost: costNum,
                stock: parseInt(newProduct.stock) || 0,
                profit: profitMargin,
                rating: "0.0 (0)",
                image: newProduct.image
            };
            setProducts([productToAdd, ...products]);
        }

        resetForm();
        setIsAddModalOpen(false);
    };

    const handleEditClick = (product: any) => {
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            cost: product.cost.toString(),
            stock: product.stock.toString(),
            image: product.image
        });
        setEditingProductId(product.id);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const resetForm = () => {
        setNewProduct({ name: '', category: 'Building Toys', price: '', cost: '', stock: '', image: '' });
        setEditingProductId(null);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="admin-content-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Products</h2>
                    <p className="page-subtitle">Manage your toy shop inventory and details</p>
                </div>
                <button className="btn-add-product" onClick={() => { resetForm(); setIsAddModalOpen(true); }}>
                    + Add Product
                </button>
            </div>

            <div className="data-card">
                <div className="data-search-bar">
                    <IconSearch />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Cost</th>
                                <th>Stock</th>
                                <th>Profit</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-cell">
                                            <div className="product-image-preview-mini">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} />
                                                ) : (
                                                    <div className="product-placeholder-mini">?</div>
                                                )}
                                            </div>
                                            <span className="product-name">{product.name}</span>
                                        </div>
                                    </td>
                                    <td>{product.category}</td>
                                    <td className="fw-600">₹{product.price.toFixed(2)}</td>
                                    <td>₹{product.cost.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge-pill ${product.stock < 15 ? 'badge-warning' : product.stock < 40 ? 'badge-caution' : 'badge-success'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="text-success fw-600">{product.profit}</td>
                                    <td className="cell-rating">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        {product.rating}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action" title="Edit" onClick={() => handleEditClick(product)}><IconEdit /></button>
                                            <button className="btn-action" title="Delete" onClick={() => handleDeleteClick(product.id)}><IconDelete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="empty-state" style={{ margin: '20px' }}>
                            No products found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingProductId !== null ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>×</button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="add-product-form">
                            <div className="form-grid">
                                <div className="form-group span-2">
                                    <label>Product Name*</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="e.g. Magic Coloring Book"
                                    />
                                </div>

                                <div className="form-group span-2">
                                    <label>Category</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option>Building Toys</option>
                                        <option>Remote Control</option>
                                        <option>Puzzles</option>
                                        <option>Action Figures</option>
                                        <option>Arts & Crafts</option>
                                        <option>Educational</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Price (₹)*</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        placeholder="29.99"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Cost (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.cost}
                                        onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                                        placeholder="12.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock Qty*</label>
                                    <input
                                        type="number"
                                        required
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        placeholder="50"
                                    />
                                </div>

                                <div className="form-group span-2">
                                    <label>Product Image*</label>
                                    <div className="image-upload-container" onClick={triggerFileInput}>
                                        {newProduct.image ? (
                                            <img src={newProduct.image} alt="Preview" className="image-preview" />
                                        ) : (
                                            <div className="image-placeholder">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                    <polyline points="21 15 16 10 5 21"></polyline>
                                                </svg>
                                                <span>Click to upload image</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">{editingProductId !== null ? 'Update Product' : 'Save Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
