import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Suppliers.css';

const API_BASE = 'http://localhost:3000/api';

export default function Suppliers() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    totalPurchased: 0,
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    fetchSuppliers();
  }, [navigate]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockSuppliers = [
        {
          id: 1,
          name: 'ABC Supplies Co.',
          email: 'contact@abcsupplies.com',
          phone: '+91 98765 43210',
          address: 'Mumbai, Maharashtra',
          totalPurchased: 45000,
          lastOrder: '2024-07-15',
        },
        {
          id: 2,
          name: 'XYZ Traders',
          email: 'info@xyztraders.com',
          phone: '+91 87654 32109',
          address: 'Delhi, Delhi',
          totalPurchased: 32500,
          lastOrder: '2024-07-10',
        },
      ];
      setSuppliers(mockSuppliers);
    } catch (error) {
      showToast('Failed to fetch suppliers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Supplier name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...formData, id: s.id } : s));
      showToast('Supplier updated successfully', 'success');
    } else {
      setSuppliers([...suppliers, { ...formData, id: Date.now() }]);
      showToast('Supplier added successfully', 'success');
    }

    setShowForm(false);
    setEditingSupplier(null);
    setFormData({ name: '', email: '', phone: '', address: '', totalPurchased: 0 });
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
      showToast('Supplier deleted successfully', 'success');
    }
  };

  const handleAddNew = () => {
    setEditingSupplier(null);
    setFormData({ name: '', email: '', phone: '', address: '', totalPurchased: 0 });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSupplier(null);
    setErrors({});
  };

  if (!user) return null;

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <div>
          <h1>📦 Suppliers</h1>
          <p>Manage your supplier relationships</p>
        </div>
        <div className="header-actions">
          <button className="btn-nav" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add Supplier
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="toast-notification">{toastMessage}</div>
      )}

      <div className="suppliers-content">
        {loading ? (
          <div className="loading">Loading suppliers...</div>
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <p>No suppliers added yet</p>
            <p>Click "Add Supplier" to get started</p>
          </div>
        ) : (
          <div className="suppliers-grid">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="supplier-card">
                <div className="card-header">
                  <h3>{supplier.name}</h3>
                  <div className="card-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(supplier)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(supplier.id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{supplier.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{supplier.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{supplier.address || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total Purchased:</span>
                    <span className="value">₹{supplier.totalPurchased?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Last Order:</span>
                    <span className="value">{supplier.lastOrder || 'Never'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
              <button className="btn-close" onClick={handleCloseForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="supplier-form">
              <div className="form-group">
                <label>Supplier Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter supplier name"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="supplier@email.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 12345 67890"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSupplier ? 'Update' : 'Add'} Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}