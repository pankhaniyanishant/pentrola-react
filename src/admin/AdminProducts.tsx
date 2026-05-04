import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import './AdminDashboard.css';
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    updateAdminProduct,
    type AdminProduct,
} from '../services/adminApi';
import { getApiErrorMessage } from '../services/api';

const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconDelete = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

type ProductForm = {
    title: string;
    category: string;
    price: string;
    stock: string;
    image: string;
    description: string;
};

const INITIAL_FORM: ProductForm = {
    title: '',
    category: 'Building Toys',
    price: '',
    stock: '',
    image: '',
    description: '',
};

const AdminProducts = () => {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState<ProductForm>(INITIAL_FORM);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getAdminProducts();
            setProducts(data);
            setError('');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to load products'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setNewProduct(INITIAL_FORM);
        setEditingProductId(null);
    };

    const handleAddSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const payload = {
            title: newProduct.title,
            category: newProduct.category,
            price: parseFloat(newProduct.price) || 0,
            stock: parseInt(newProduct.stock, 10) || 0,
            image: newProduct.image,
            description: newProduct.description || newProduct.title,
        };

        try {
            if (editingProductId) {
                const updated = await updateAdminProduct(editingProductId, payload);
                setProducts((prev) => prev.map((p) => (p._id === editingProductId ? updated : p)));
            } else {
                const created = await createAdminProduct(payload);
                setProducts((prev) => [created, ...prev]);
            }
            resetForm();
            setIsAddModalOpen(false);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to save product'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (product: AdminProduct) => {
        setNewProduct({
            title: product.title,
            category: product.category || 'Building Toys',
            price: product.price.toString(),
            stock: product.stock.toString(),
            image: product.image || '',
            description: product.description || '',
        });
        setEditingProductId(product._id);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await deleteAdminProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to delete product'));
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct((prev) => ({ ...prev, image: String(reader.result || '') }));
        };
        reader.readAsDataURL(file);
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

            {error && (
                <div className="empty-state" style={{ marginBottom: '12px', color: '#B91C1C' }}>
                    {error}
                </div>
            )}

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
                    {loading ? (
                        <div className="empty-state" style={{ margin: '20px' }}>Loading products...</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => {
                                    return (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="product-cell">
                                                    <div className="product-image-preview-mini">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.title} />
                                                        ) : (
                                                            <div className="product-placeholder-mini">?</div>
                                                        )}
                                                    </div>
                                                    <span className="product-name">{product.title}</span>
                                                </div>
                                            </td>
                                            <td>{product.category}</td>
                                            <td className="fw-600">₹{product.price.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge-pill ${product.stock < 15 ? 'badge-warning' : product.stock < 40 ? 'badge-caution' : 'badge-success'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-action" title="Edit" onClick={() => handleEditClick(product)}><IconEdit /></button>
                                                    <button className="btn-action" title="Delete" onClick={() => handleDeleteClick(product._id)}><IconDelete /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="empty-state" style={{ margin: '20px' }}>
                            No products found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>×</button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="add-product-form">
                            <div className="form-grid">
                                <div className="form-group span-2">
                                    <label>Product Name*</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.title}
                                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                        placeholder="e.g. Magic Coloring Book"
                                    />
                                </div>

                                <div className="form-group span-2">
                                    <label>Description*</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        placeholder="Short product description"
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
                                    <div className="image-upload-container" onClick={() => fileInputRef.current?.click()}>
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
                                <button type="submit" className="btn-save" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingProductId ? 'Update Product' : 'Save Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
