import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  X,
  AlertCircle,
  Download,
  Eye,
  Plus,
  Edit3,
  Trash2,
  Clock,
  TrendingUp,
  Receipt
} from 'lucide-react';
import './Payments.css';

const Payments = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);

  // Mock payments data - in real app, this would come from Firestore
  useEffect(() => {
    const mockPayments = [
      {
        id: '1',
        type: 'membership',
        amount: 50.00,
        status: 'completed',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        description: 'Monthly Membership Fee',
        paymentMethod: 'credit_card',
        last4: '1234',
        invoiceNumber: 'INV-2024-001',
        category: 'membership'
      },
      {
        id: '2',
        type: 'personal_training',
        amount: 75.00,
        status: 'completed',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        description: 'Personal Training Session',
        paymentMethod: 'credit_card',
        last4: '1234',
        invoiceNumber: 'INV-2024-002',
        category: 'services'
      },
      {
        id: '3',
        type: 'shop',
        amount: 29.99,
        status: 'completed',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        description: 'Resistance Bands Set',
        paymentMethod: 'credit_card',
        last4: '1234',
        invoiceNumber: 'INV-2024-003',
        category: 'shop'
      },
      {
        id: '4',
        type: 'membership',
        amount: 50.00,
        status: 'pending',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        description: 'Monthly Membership Fee',
        paymentMethod: 'credit_card',
        last4: '1234',
        invoiceNumber: 'INV-2024-004',
        category: 'membership'
      },
      {
        id: '5',
        type: 'supplements',
        amount: 45.99,
        status: 'failed',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        description: 'Protein Powder',
        paymentMethod: 'credit_card',
        last4: '1234',
        invoiceNumber: 'INV-2024-005',
        category: 'shop'
      }
    ];

    const mockPaymentMethods = [
      {
        id: '1',
        type: 'credit_card',
        name: 'Visa ending in 1234',
        last4: '1234',
        expiry: '12/25',
        isDefault: true,
        brand: 'visa'
      },
      {
        id: '2',
        type: 'credit_card',
        name: 'Mastercard ending in 5678',
        last4: '5678',
        expiry: '08/26',
        isDefault: false,
        brand: 'mastercard'
      }
    ];

    setPayments(mockPayments);
    setPaymentMethods(mockPaymentMethods);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#2ed573';
      case 'pending': return '#feca57';
      case 'failed': return '#ff6b7a';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'failed': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'membership': return <Calendar size={16} />;
      case 'services': return <TrendingUp size={16} />;
      case 'shop': return <Receipt size={16} />;
      default: return <DollarSign size={16} />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalSpent = () => {
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(payment => payment.status === 'pending')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const handlePaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const downloadInvoice = (payment) => {
    // In real app, this would generate and download a PDF invoice
    console.log('Downloading invoice for:', payment.invoiceNumber);
  };

  const addPaymentMethod = () => {
    setShowAddMethodModal(true);
  };

  const removePaymentMethod = (methodId) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const setDefaultMethod = (methodId) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  if (loading) {
    return (
      <div className="payments-container">
        <div className="loading-spinner"></div>
        <p>Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <div className="payments-header">
        <div className="header-content">
          <h1>Payment History</h1>
          <p>Manage your billing information and view payment history</p>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={addPaymentMethod}>
            <Plus size={20} />
            Add Payment Method
          </button>
        </div>
      </div>

      <div className="payments-content">
        {/* Payment Summary */}
        <div className="payment-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <DollarSign size={24} />
            </div>
            <div className="summary-content">
              <h3>Total Spent</h3>
              <p className="summary-value">${getTotalSpent().toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <Clock size={24} />
            </div>
            <div className="summary-content">
              <h3>Pending Payments</h3>
              <p className="summary-value">${getPendingAmount().toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <CreditCard size={24} />
            </div>
            <div className="summary-content">
              <h3>Payment Methods</h3>
              <p className="summary-value">{paymentMethods.length}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods-section">
          <h2>Payment Methods</h2>
          <div className="methods-grid">
            {paymentMethods.map(method => (
              <div key={method.id} className="method-card">
                <div className="method-info">
                  <div className="method-icon">
                    <CreditCard size={20} />
                  </div>
                  <div className="method-details">
                    <h3>{method.name}</h3>
                    <p>Expires {method.expiry}</p>
                    {method.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                </div>
                <div className="method-actions">
                  {!method.isDefault && (
                    <button 
                      className="action-btn small"
                      onClick={() => setDefaultMethod(method.id)}
                    >
                      Set Default
                    </button>
                  )}
                  <button 
                    className="action-btn small"
                    onClick={() => {/* Edit method */}}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className="action-btn small danger"
                    onClick={() => removePaymentMethod(method.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="payment-history-section">
          <h2>Payment History</h2>
          <div className="payments-table">
            <div className="table-header">
              <div className="header-cell">Date</div>
              <div className="header-cell">Description</div>
              <div className="header-cell">Category</div>
              <div className="header-cell">Amount</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Actions</div>
            </div>
            
            <div className="table-body">
              {payments.map(payment => (
                <div key={payment.id} className="table-row">
                  <div className="table-cell">
                    <span className="date">{formatDate(payment.date)}</span>
                  </div>
                  <div className="table-cell">
                    <div className="description">
                      <h4>{payment.description}</h4>
                      <p>Invoice: {payment.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="category">
                      {getCategoryIcon(payment.category)}
                      <span>{payment.category}</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="amount">${payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="table-cell">
                    <div 
                      className="status-badge"
                      style={{ '--status-color': getStatusColor(payment.status) }}
                    >
                      {getStatusIcon(payment.status)}
                      <span>{payment.status}</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="row-actions">
                      <button 
                        className="action-btn small"
                        onClick={() => handlePaymentDetails(payment)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn small"
                        onClick={() => downloadInvoice(payment)}
                        title="Download Invoice"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="payment-details">
                <div className="detail-row">
                  <span className="label">Invoice Number</span>
                  <span className="value">{selectedPayment.invoiceNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Description</span>
                  <span className="value">{selectedPayment.description}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount</span>
                  <span className="value amount">${selectedPayment.amount.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date</span>
                  <span className="value">{formatDate(selectedPayment.date)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status</span>
                  <div 
                    className="status-badge"
                    style={{ '--status-color': getStatusColor(selectedPayment.status) }}
                  >
                    {getStatusIcon(selectedPayment.status)}
                    <span>{selectedPayment.status}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Method</span>
                  <span className="value">•••• •••• •••• {selectedPayment.last4}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Category</span>
                  <div className="category">
                    {getCategoryIcon(selectedPayment.category)}
                    <span>{selectedPayment.category}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="download-btn"
                onClick={() => downloadInvoice(selectedPayment)}
              >
                <Download size={20} />
                Download Invoice
              </button>
              <button 
                className="close-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h2>Add Payment Method</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowAddMethodModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="add-method-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" />
                    Set as default payment method
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddMethodModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={() => {
                  // Add payment method logic
                  setShowAddMethodModal(false);
                }}
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments; 