import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  Calendar,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import api from '../../axiosConfig';
import './StaffPages.css';

const ViewMembers = () => {
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/members/all');
      setMembers(response.data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberID?.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#2ed573';
      case 'inactive': return '#ff6b7a';
      case 'expired': return '#feca57';
      default: return '#a4b0be';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <XCircle size={16} />;
      case 'expired': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const openMemberDetails = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-dashboard">
        <div className="error-container">
          <AlertCircle size={48} />
          <p>{error}</p>
          <button onClick={fetchMembers}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>View Members</h1>
          <p>Browse and manage member information</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <h3>Total Members</h3>
              <p>{members.length}</p>
            </div>
          </div>
          <div className="stat-card active">
            <CheckCircle size={24} />
            <div>
              <h3>Active</h3>
              <p>{members.filter(m => m.status === 'active').length}</p>
            </div>
          </div>
          <div className="stat-card pending">
            <AlertCircle size={24} />
            <div>
              <h3>Expired</h3>
              <p>{members.filter(m => m.status === 'expired').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="members-content">
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search members by name, email, or ID..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="members-grid">
          {filteredMembers.map((member) => (
            <div key={member._id} className="member-card">
              <div className="member-header">
                <div className="member-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=00CFFF&color=fff&size=60`}
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = '/default-avatar.svg';
                    }}
                  />
                </div>
                <div className="member-status" style={{ color: getStatusColor(member.status) }}>
                  {getStatusIcon(member.status)}
                  <span>{member.status}</span>
                </div>
              </div>
              
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="member-id">ID: {member.memberID}</p>
                <div className="member-details">
                  <div className="detail-item">
                    <Mail size={16} />
                    <span>{member.email}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{member.phone}</span>
                  </div>
                  <div className="detail-item">
                    <Award size={16} />
                    <span>{member.membershipType}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Joined: {new Date(member.joiningDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="member-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => openMemberDetails(member)}
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="empty-state">
            <Users size={64} />
            <h3>No members found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {showModal && selectedMember && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Member Details</h2>
              <button className="close-btn" onClick={closeModal}>
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="member-detail-section">
                <div className="detail-row">
                  <label>Name:</label>
                  <span>{selectedMember.name}</span>
                </div>
                <div className="detail-row">
                  <label>Member ID:</label>
                  <span>{selectedMember.memberID}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedMember.email}</span>
                </div>
                <div className="detail-row">
                  <label>Phone:</label>
                  <span>{selectedMember.phone}</span>
                </div>
                <div className="detail-row">
                  <label>Membership Type:</label>
                  <span className="membership-badge">{selectedMember.membershipType}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className="status-badge" style={{ color: getStatusColor(selectedMember.status) }}>
                    {getStatusIcon(selectedMember.status)}
                    {selectedMember.status}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Joining Date:</label>
                  <span>{new Date(selectedMember.joiningDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <label>Membership Duration:</label>
                  <span>{selectedMember.membershipDuration} days</span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMembers; 