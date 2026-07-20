import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionList from '../../components/TransactionList';
import TransactionForm from '../../components/TransactionForm';
import './Dashboard.css';

const API_BASE = 'http://localhost:3000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Check user logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Fetch transactions
  const fetchTransactions = async (page = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/transactions?shopkeeperId=${user.shopkeeperId}&page=${page}&limit=10`
      );
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch transactions');
      
      setTransactions(data.data || []);
      setCurrentPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance
  const fetchBalance = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${API_BASE}/balance?shopkeeperId=${user.shopkeeperId}`
      );
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch balance');
      
      setBalance(parseFloat(data.balance) || 0);
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      fetchTransactions(1);
      fetchBalance();
    }
  }, [user]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          shopkeeperId: user.shopkeeperId,
        }),
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
      
      showToast('Transaction deleted', 'success');
      fetchTransactions(currentPage);
      fetchBalance();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = async () => {
    handleFormClose();
    await fetchTransactions(1);
    await fetchBalance();
    showToast(editingTransaction ? 'Transaction updated' : 'Transaction created', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>💰 Digital Ledger</h1>
          <p>Welcome, {user.email}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <div className="balance-card-container">
        <div className="balance-card">
          <div className="balance-label">Running Balance</div>
          <div className="balance-amount">₹{balance.toFixed(2)}</div>
          <div className="balance-meta">{transactions.length} transactions</div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h2>Transaction History</h2>
          <button className="btn btn-primary" onClick={handleAddTransaction}>
            + Add Transaction
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet</p>
            <p>Click "Add Transaction" to get started</p>
          </div>
        ) : (
          <>
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onViewAudit={(id) => console.log('View audit for', id)}
            />
            
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchTransactions(currentPage - 1)}
              >
                Previous
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => fetchTransactions(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <TransactionForm
              transaction={editingTransaction}
              user={user}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
              onShowToast={showToast}
            />
          </div>
        </div>
      )}
    </div>
  );
}
