import { useEffect, useMemo, useState } from 'react';
import './AdminDashboard.css';
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    updateAdminProduct,
    type AdminProduct,
} from '../services/adminApi';
import { getApiErrorMessage } from '../services/api';

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconDelete = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconView = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

type InventoryForm = {
  title: string;
  category: string;
  stock: string;
  price: string;
  description: string;
};

const INITIAL_FORM: InventoryForm = {
  title: '',
  category: 'Educational',
  stock: '0',
  price: '0',
  description: '',
};

const AdminInventory = () => {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewingItemId, setViewingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<InventoryForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getAdminProducts();
      setItems(data);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load inventory'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item._id.toLowerCase().includes(searchTerm.toLowerCase())
  ), [items, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    try {
      await deleteAdminProduct(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete item'));
    }
  };

  const handleEdit = (item: AdminProduct) => {
    setEditingItemId(item._id);
    setNewItem({
      title: item.title,
      category: item.category || 'Educational',
      stock: item.stock.toString(),
      price: item.price.toString(),
      description: item.description || '',
    });
    setShowModal(true);
  };

  const handleView = (id: string) => {
    setViewingItemId(id);
    setShowViewModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: newItem.title,
      category: newItem.category,
      stock: parseInt(newItem.stock, 10) || 0,
      price: parseFloat(newItem.price) || 0,
      description: newItem.description || newItem.title,
    };

    try {
      if (editingItemId) {
        const updated = await updateAdminProduct(editingItemId, payload);
        setItems((prev) => prev.map((i) => (i._id === editingItemId ? updated : i)));
      } else {
        const created = await createAdminProduct(payload);
        setItems((prev) => [created, ...prev]);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save inventory item'));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingItemId(null);
    setNewItem(INITIAL_FORM);
  };

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) return <span className="badge-pill badge-warning">Out of Stock</span>;
    if (quantity < 10) return <span className="badge-pill badge-caution">Low Stock</span>;
    return <span className="badge-pill badge-success">In Stock</span>;
  };

  const viewingItem = items.find((i) => i._id === viewingItemId);

  return (
    <div className="admin-content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Inventory</h2>
          <p className="page-subtitle">Manage store inventory and stock levels</p>
        </div>
        <button className="btn-add-product" onClick={() => { resetForm(); setShowModal(true); }}>
          + Add New Item
        </button>
      </div>

      {error && <div className="empty-state" style={{ marginBottom: '12px', color: '#B91C1C' }}>{error}</div>}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingItemId !== null ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form className="add-product-form" onSubmit={handleSaveItem}>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Item Name*</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select value={newItem.category} onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}>
                    <option value="Educational">Educational</option>
                    <option value="Building Toys">Building Toys</option>
                    <option value="Puzzles">Puzzles</option>
                    <option value="Action Figures">Action Figures</option>
                    <option value="Arts & Crafts">Arts & Crafts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, stock: e.target.value }))}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group span-2">
                  <label>Description</label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : (editingItemId !== null ? 'Update Item' : 'Save Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && viewingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Item Details</h2>
              <button className="btn-close-modal" onClick={() => setShowViewModal(false)}>&times;</button>
            </div>

            <div className="view-details" style={{ padding: '10px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontWeight: 600, color: '#6B7280' }}>Name:</span>
                <span style={{ fontWeight: 600 }}>{viewingItem.title}</span>
                <span style={{ fontWeight: 600, color: '#6B7280' }}>SKU:</span>
                <span>{viewingItem._id.slice(-8).toUpperCase()}</span>
                <span style={{ fontWeight: 600, color: '#6B7280' }}>Category:</span>
                <span>{viewingItem.category}</span>
                <span style={{ fontWeight: 600, color: '#6B7280' }}>Quantity:</span>
                <span className="fw-600">{viewingItem.stock}</span>
                <span style={{ fontWeight: 600, color: '#6B7280' }}>Price:</span>
                <span className="fw-600">₹{viewingItem.price.toFixed(2)}</span>
                <span style={{ fontWeight: 600, color: '#6B7280' }}>Status:</span>
                <span>{getStatusBadge(viewingItem.stock)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="data-card">
        <div className="data-search-bar">
          <IconSearch />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="empty-state" style={{ margin: '20px' }}>Loading inventory...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item._id.slice(-8).toUpperCase()}</td>
                    <td>{item.category}</td>
                    <td>{item.stock}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>{getStatusBadge(item.stock)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action" title="View" onClick={() => handleView(item._id)}><IconView /></button>
                        <button className="btn-action" title="Edit" onClick={() => handleEdit(item)}><IconEdit /></button>
                        <button className="btn-action" title="Delete" onClick={() => handleDelete(item._id)}><IconDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="empty-state" style={{ margin: '20px' }}>
              No inventory items found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
