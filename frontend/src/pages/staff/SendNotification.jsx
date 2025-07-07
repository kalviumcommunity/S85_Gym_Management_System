import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Bell, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  User,
  Target,
  Calendar
} from 'lucide-react';
import api from '../../axiosConfig';
import './StaffPages.css';

const SendNotification = () => {
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal',
    recipients: 'all', // 'all', 'active', 'expired', 'custom'
    selectedMembers: []
  });

  // Notification history
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchNotificationHistory();
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

  const fetchNotificationHistory = async () => {
    try {
      // Mock notification history - replace with actual API call
      const mockHistory = [
        {
          id: 1,
          title: 'Gym Maintenance Notice',
          message: 'The gym will be closed for maintenance on Sunday from 2-6 PM.',
          type: 'maintenance',
          priority: 'high',
          recipients: 'all',
          sentAt: new Date(Date.now() - 86400000), // 1 day ago
          status: 'sent'
        },
        {
          id: 2,
          title: 'New Class Available',
          message: 'Join our new HIIT class every Monday at 6 AM!',
          type: 'announcement',
          priority: 'normal',
          recipients: 'active',
          sentAt: new Date(Date.now() - 172800000), // 2 days ago
          status: 'sent'
        }
      ];
      setNotifications(mockHistory);
    } catch (err) {
      console.error('Error fetching notification history:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberSelection = (memberId) => {
    setNotificationData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }));
  };

  const getRecipientCount = () => {
    switch (notificationData.recipients) {
      case 'all':
        return members.length;
      case 'active':
        return members.filter(m => m.status === 'active').length;
      case 'expired':
        return members.filter(m => m.status === 'expired').length;
      case 'custom':
        return notificationData.selectedMembers.length;
      default:
        return 0;
    }
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    
    if (!notificationData.title.trim() || !notificationData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSending(true);
      setError('');
      setSuccess('');

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newNotification = {
        id: Date.now(),
        ...notificationData,
        sentAt: new Date(),
        status: 'sent'
      };

      setNotifications(prev => [newNotification, ...prev]);
      setSuccess(`Notification sent successfully to ${getRecipientCount()} members!`);
      
      // Reset form
      setNotificationData({
        title: '',
        message: '',
        type: 'general',
        priority: 'normal',
        recipients: 'all',
        selectedMembers: []
      });

    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b7a';
      case 'normal': return '#00CFFF';
      case 'low': return '#a4b0be';
      default: return '#00CFFF';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return <AlertCircle size={16} />;
      case 'announcement': return <Bell size={16} />;
      case 'reminder': return <Clock size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notification center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Send Notifications</h1>
          <p>Communicate with members and send important updates</p>
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
            <MessageSquare size={24} />
            <div>
              <h3>Sent Today</h3>
              <p>{notifications.filter(n => 
                new Date(n.sentAt).toDateString() === new Date().toDateString()
              ).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="notification-content">
        <div className="content-grid">
          {/* Send Notification Form */}
          <div className="notification-form-section">
            <h2>Create New Notification</h2>
            <form onSubmit={sendNotification} className="notification-form">
              <div className="form-group">
                <label htmlFor="title">Notification Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={notificationData.title}
                  onChange={handleInputChange}
                  placeholder="Enter notification title..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={notificationData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={notificationData.type}
                    onChange={handleInputChange}
                  >
                    <option value="general">General</option>
                    <option value="announcement">Announcement</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={notificationData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="recipients">Recipients</label>
                <select
                  id="recipients"
                  name="recipients"
                  value={notificationData.recipients}
                  onChange={handleInputChange}
                >
                  <option value="all">All Members ({members.length})</option>
                  <option value="active">Active Members ({members.filter(m => m.status === 'active').length})</option>
                  <option value="expired">Expired Members ({members.filter(m => m.status === 'expired').length})</option>
                  <option value="custom">Custom Selection</option>
                </select>
              </div>

              {notificationData.recipients === 'custom' && (
                <div className="form-group">
                  <label>Select Members</label>
                  <div className="member-selection">
                    {members.map(member => (
                      <label key={member._id} className="member-checkbox">
                        <input
                          type="checkbox"
                          checked={notificationData.selectedMembers.includes(member._id)}
                          onChange={() => handleMemberSelection(member._id)}
                        />
                        <span>{member.name}</span>
                        <span className="member-status">{member.status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="success-message">
                  <CheckCircle size={16} />
                  <span>{success}</span>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send to {getRecipientCount()} members
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Notification History */}
          <div className="notification-history-section">
            <h2>Recent Notifications</h2>
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-header">
                    <div className="notification-type" style={{ color: getPriorityColor(notification.priority) }}>
                      {getTypeIcon(notification.type)}
                      <span>{notification.type}</span>
                    </div>
                    <div className="notification-priority" style={{ color: getPriorityColor(notification.priority) }}>
                      {notification.priority}
                    </div>
                  </div>
                  
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                  </div>
                  
                  <div className="notification-footer">
                    <div className="notification-meta">
                      <span className="recipients">
                        <Users size={14} />
                        {notification.recipients === 'all' ? 'All Members' : 
                         notification.recipients === 'active' ? 'Active Members' :
                         notification.recipients === 'expired' ? 'Expired Members' : 'Custom'}
                      </span>
                      <span className="sent-time">
                        <Clock size={14} />
                        {new Date(notification.sentAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="notification-status">
                      {notification.status === 'sent' ? (
                        <CheckCircle size={16} className="success-icon" />
                      ) : (
                        <Clock size={16} className="pending-icon" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotification; 