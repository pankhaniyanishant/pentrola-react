import { useState } from 'react';
import './AdminDashboard.css';

// SVG Icons
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

// Mock inventory data
const MOCK_INVENTORY = [
  { id: 1, name: 'sequence', sku: 'RTS-001', quantity: 120, price: 19.99, category: 'Toy', lastUpdated: '2026-03-15' },
  { id: 2, name: 'flip & match', sku: 'BJ-002', quantity: 8, price: 49.5, category: 'Apparel', lastUpdated: '2026-03-16' },
  { id: 3, name: 'kids gun', sku: 'WM-003', quantity: 200, price: 25.0, category: 'Electronics', lastUpdated: '2026-03-14' },
  { id: 4, name: 'Artist Brush Set', sku: 'CM-004', quantity: 0, price: 9.99, category: 'Home', lastUpdated: '2026-03-17' },
  { id: 5, name: 'premium can', sku: 'NB-005', quantity: 80, price: 3.5, category: 'Stationery', lastUpdated: '2026-03-10' },
  { id: 6, name: 'colorful blocks', sku: 'RS-006', quantity: 25, price: 89.99, category: 'Footwear', lastUpdated: '2026-03-18' },
  { id: 7, name: 'train set bucket', sku: 'DL-007', quantity: 15, price: 29.99, category: 'Electronics', lastUpdated: '2026-03-12' },
];

const AdminInventory = () => {
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [viewingItemId, setViewingItemId] = useState<number | null>(null);

  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
    category: 'Apparel'
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleEdit = (item: any) => {
    setEditingItemId(item.id);
    setNewItem({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      category: item.category
    });
    setShowModal(true);
  };

  const handleView = (id: number) => {
    setViewingItemId(id);
    setShowViewModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.sku) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingItemId !== null) {
      // Update existing item
      setItems(items.map(p => p.id === editingItemId ? {
        ...p,
        ...newItem,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : p));
    } else {
      // Add new item
      const itemToAdd = {
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        ...newItem,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setItems([itemToAdd, ...items]);
    }

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingItemId(null);
    setNewItem({
      name: '',
      sku: '',
      quantity: 0,
      price: 0,
      category: 'Apparel'
    });
  };

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) return <span className="badge-pill badge-warning">Out of Stock</span>;
    if (quantity < 10) return <span className="badge-pill badge-caution">Low Stock</span>;
    return <span className="badge-pill badge-success">In Stock</span>;
  };

  const viewingItem = items.find(i => i.id === viewingItemId);

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

      {/* Add/Edit Modal */}
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
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Cotton T-Shirt"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>SKU*</label>
                  <input
                    type="text"
                    name="sku"
                    value={newItem.sku}
                    onChange={handleInputChange}
                    placeholder="SKU-001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={newItem.category} onChange={handleInputChange}>
                    <option value="Apparel">Apparel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home">Home</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">
                  {editingItemId !== null ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
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
                <span style={{ fontWeight: 600 }}>{viewingItem.name}</span>

                <span style={{ fontWeight: 600, color: '#6B7280' }}>SKU:</span>
                <span>{viewingItem.sku}</span>

                <span style={{ fontWeight: 600, color: '#6B7280' }}>Category:</span>
                <span>{viewingItem.category}</span>

                <span style={{ fontWeight: 600, color: '#6B7280' }}>Quantity:</span>
                <span className="fw-600">{viewingItem.quantity}</span>

                <span style={{ fontWeight: 600, color: '#6B7280' }}>Price:</span>
                <span className="fw-600">₹{viewingItem.price.toFixed(2)}</span>

                <span style={{ fontWeight: 600, color: '#6B7280' }}>Status:</span>
                <span>{getStatusBadge(viewingItem.quantity)}</span>

                <span style={{ fontWeight: 600, color: '#6B7280' }}>Last Updated:</span>
                <span>{viewingItem.lastUpdated}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-save" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="data-card">
        <div className="data-search-bar">
          <IconSearch />
          <input
            type="text"
            placeholder="Search items by name or SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-name">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.sku}</td>
                  <td className="fw-600">{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>{item.category}</td>
                  <td>{getStatusBadge(item.quantity)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action" title="View" onClick={() => handleView(item.id)}><IconView /></button>
                      <button className="btn-action" title="Edit" onClick={() => handleEdit(item)}><IconEdit /></button>
                      <button className="btn-action" title="Delete" onClick={() => handleDelete(item.id)}><IconDelete /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
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
