import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Customers.css';

const API_BASE = 'http://localhost:3000/api';

export default function Customers() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
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
    fetchCustomers();
  }, [navigate]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockCustomers = [
        {
          id: 1,
          name: 'Retail Store A',
          email: 'contact@retaila.com',
          phone: '+91 98765 43210',
          address: 'Bangalore, Karnataka',
          totalPurchased: 65000,
          lastOrder: '2024-07-18',
        },
        {
          id: 2,
          name: 'Shop B',
          email: 'info@shopb.com',
          phone: '+91 87654 32109',
          address: 'Pune, Maharashtra',
          totalPurchased: 42500,
          lastOrder: '2024-07-16',
        },
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      showToast('Failed to fetch customers', 'error');
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
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...formData, id: c.id } : c));
      showToast('Customer updated successfully', 'success');
    } else {
      setCustomers([...customers, { ...formData, id: Date.now() }]);
      showToast('Customer added successfully', 'success');
    }

    setShowForm(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '', totalPurchased: 0 });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
      showToast('Customer deleted successfully', 'success');
    }
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '', totalPurchased: 0 });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setErrors({});
  };

  if (!user) return null;

  return (
    <div className="customers-container">
      <div className="customers-header">
        <div>
          <h1>👥 Customers</h1>
          <p>Manage your customer relationships</p>
        </div>
        <div className="header-actions">
          <button className="btn-nav" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add Customer
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="toast-notification">{toastMessage}</div>
      )}

      <div className="customers-content">
        {loading ? (
          <div className="loading">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <p>No customers added yet</p>
            <p>Click "Add Customer" to get started</p>
          </div>
        ) : (
          <div className="customers-grid">
            {customers.map(customer => (
              <div key={customer.id} className="customer-card">
                <div className="card-header">
                  <h3>{customer.name}</h3>
                  <div className="card-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(customer)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(customer.id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{customer.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{customer.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{customer.address || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total Purchased:</span>
                    <span className="value">₹{customer.totalPurchased?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Last Order:</span>
                    <span className="value">{customer.lastOrder || 'Never'}</span>
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
              <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              <button className="btn-close" onClick={handleCloseForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="customer-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter customer name"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@email.com"
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
                  {editingCustomer ? 'Update' : 'Add'} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}