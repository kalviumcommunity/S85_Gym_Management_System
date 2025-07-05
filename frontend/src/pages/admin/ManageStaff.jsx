import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Search
} from 'lucide-react';
import './AdminPages.css';

const ManageStaff = () => {
  const { getAllStaffMembers, approveStaffMember, rejectStaffMember } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, active

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      setLoading(true);
      const members = await getAllStaffMembers();
      setStaffMembers(members);
    } catch (error) {
      console.error('Error loading staff members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveStaffMember(userId);
      await loadStaffMembers(); // Reload the list
    } catch (error) {
      console.error('Error approving staff member:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectStaffMember(userId);
      await loadStaffMembers(); // Reload the list
    } catch (error) {
      console.error('Error rejecting staff member:', error);
    }
  };

  const filteredMembers = staffMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'pending') return matchesSearch && member.role === 'pending_staff';
    if (filter === 'active') return matchesSearch && member.role === 'staff';
    return matchesSearch;
  });

  const pendingCount = staffMembers.filter(m => m.role === 'pending_staff').length;
  const activeCount = staffMembers.filter(m => m.role === 'staff').length;

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner"></div>
        <p>Loading staff members...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <h1>Manage Staff Members</h1>
          <p>Approve, reject, and manage your gym staff</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <h3>Total Staff</h3>
              <p>{staffMembers.length}</p>
            </div>
          </div>
          <div className="stat-card pending">
            <Clock size={24} />
            <div>
              <h3>Pending</h3>
              <p>{pendingCount}</p>
            </div>
          </div>
          <div className="stat-card active">
            <UserCheck size={24} />
            <div>
              <h3>Active</h3>
              <p>{activeCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="controls-section">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({staffMembers.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
              <button 
                className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active ({activeCount})
              </button>
            </div>
          </div>
        </div>

        <div className="staff-list">
          {filteredMembers.length === 0 ? (
            <div className="empty-state">
              <Users size={80} />
              <h3>No staff members found</h3>
              <p>No staff members match your current filters.</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div key={member.id} className="staff-card">
                <div className="staff-info">
                  <img 
                    src={member.profileURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=00CFFF&color=fff&size=100`} 
                    alt={member.name}
                    className="staff-avatar"
                  />
                  <div className="staff-details">
                    <h3>{member.name}</h3>
                    <p className="staff-email">{member.email}</p>
                    <div className="staff-meta">
                      <span className={`status-badge ${member.role === 'pending_staff' ? 'pending' : 'active'}`}>
                        {member.role === 'pending_staff' ? 'Pending Approval' : 'Active Staff'}
                      </span>
                      <span className="join-date">
                        Joined: {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="staff-actions">
                  {member.role === 'pending_staff' ? (
                    <>
                      <button 
                        className="approve-btn"
                        onClick={() => handleApprove(member.id)}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleReject(member.id)}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="approved-badge">
                      <CheckCircle size={16} />
                      Approved
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStaff; 