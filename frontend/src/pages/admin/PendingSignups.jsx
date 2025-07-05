import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X, Eye, Search, Filter, Calendar, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import './AdminPages.css';

const PendingSignups = () => {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionModal, setActionModal] = useState({ show: false, action: '', signup: null });
  const [notes, setNotes] = useState('');

  const statuses = ['pending', 'approved', 'rejected'];

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      const response = await axios.get('/api/admin/pending-signups');
      setSignups(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching signups:', error);
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(`/api/admin/pending-signups/${actionModal.signup._id}/approve`, { notes });
      setActionModal({ show: false, action: '', signup: null });
      setNotes('');
      fetchSignups();
    } catch (error) {
      console.error('Error approving signup:', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`/api/admin/pending-signups/${actionModal.signup._id}/reject`, { notes });
      setActionModal({ show: false, action: '', signup: null });
      setNotes('');
      fetchSignups();
    } catch (error) {
      console.error('Error rejecting signup:', error);
    }
  };

  const openActionModal = (signup, action) => {
    setActionModal({ show: true, action, signup });
    setNotes('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSignups = signups.filter(signup => {
    const matchesSearch = signup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signup.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || signup.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          <UserPlus className="header-icon" />
          <div>
            <h1>Pending Signups</h1>
            <p>Review and approve new member registrations and manage signup requests.</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="signups-list">
        {filteredSignups.map(signup => (
          <div key={signup._id} className="signup-card">
            <div className="signup-header">
              <div className="signup-info">
                <h3>{signup.name}</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{signup.email}</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{signup.phone}</span>
                  </div>
                </div>
              </div>
              <div className="signup-status">
                <span className={`status-badge ${getStatusColor(signup.status)}`}>
                  {signup.status.charAt(0).toUpperCase() + signup.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="signup-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Membership Type:</span>
                  <span>{signup.membershipType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span>{signup.membershipDuration}</span>
                </div>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Applied: {formatDate(signup.created_at)}</span>
              </div>
              {signup.notes && (
                <div className="notes">
                  <span className="label">Notes:</span>
                  <span>{signup.notes}</span>
                </div>
              )}
            </div>

            <div className="signup-actions">
              <button 
                className="btn-icon"
                onClick={() => {
                  setSelectedSignup(signup);
                  setShowModal(true);
                }}
              >
                <Eye size={16} />
              </button>
              {signup.status === 'pending' && (
                <>
                  <button 
                    className="btn-icon btn-success"
                    onClick={() => openActionModal(signup, 'approve')}
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => openActionModal(signup, 'reject')}
                  >
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showModal && selectedSignup && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Signup Details</h2>
              <button 
                className="btn-icon"
                onClick={() => {
                  setShowModal(false);
                  setSelectedSignup(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Name:</span>
                    <span>{selectedSignup.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <span>{selectedSignup.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <span>{selectedSignup.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Membership Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span>{selectedSignup.membershipType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span>{selectedSignup.membershipDuration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className={`status-badge ${getStatusColor(selectedSignup.status)}`}>
                      {selectedSignup.status.charAt(0).toUpperCase() + selectedSignup.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Timeline</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Applied:</span>
                    <span>{formatDate(selectedSignup.created_at)}</span>
                  </div>
                  {selectedSignup.reviewed_at && (
                    <div className="detail-item">
                      <span className="label">Reviewed:</span>
                      <span>{formatDate(selectedSignup.reviewed_at)}</span>
                    </div>
                  )}
                  {selectedSignup.reviewed_by && (
                    <div className="detail-item">
                      <span className="label">Reviewed by:</span>
                      <span>{selectedSignup.reviewed_by.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedSignup.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p>{selectedSignup.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{actionModal.action === 'approve' ? 'Approve Signup' : 'Reject Signup'}</h2>
              <button 
                className="btn-icon"
                onClick={() => setActionModal({ show: false, action: '', signup: null })}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to {actionModal.action} this signup request?</p>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setActionModal({ show: false, action: '', signup: null })}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={actionModal.action === 'approve' ? 'btn-success' : 'btn-danger'}
                  onClick={actionModal.action === 'approve' ? handleApprove : handleReject}
                >
                  {actionModal.action === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingSignups; 