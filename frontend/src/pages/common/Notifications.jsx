import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Bell, 
  CheckCircle, 
  X, 
  AlertCircle, 
  Info,
  Clock,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import api from '../../axiosConfig';
import './Notifications.css';

const Notifications = () => {
  const { currentUser, userRole } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showRead, setShowRead] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [userRole]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have a notifications API yet
      // In a real app, this would be: const response = await api.get('/notifications');
      
      const mockNotifications = [
        {
          id: '1',
          title: 'Payment Due Reminder',
          message: 'Your monthly membership fee of $50 is due in 5 days.',
          type: 'payment',
          priority: 'high',
          read: false,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          sender: 'System',
          actionRequired: true
        },
        {
          id: '2',
          title: 'New Class Available',
          message: 'Yoga class with Sarah has been added to the schedule for tomorrow at 9 AM.',
          type: 'class',
          priority: 'medium',
          read: false,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          sender: 'Gym Staff',
          actionRequired: false
        },
        {
          id: '3',
          title: 'Equipment Maintenance',
          message: 'Treadmill #3 is currently under maintenance. Please use alternative equipment.',
          type: 'maintenance',
          priority: 'low',
          read: true,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          sender: 'Maintenance Team',
          actionRequired: false
        },
        {
          id: '4',
          title: 'Welcome to Premium Membership!',
          message: 'Congratulations! You have been upgraded to premium membership with access to all facilities.',
          type: 'membership',
          priority: 'high',
          read: false,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          sender: 'Admin',
          actionRequired: false
        },
        {
          id: '5',
          title: 'Holiday Schedule Update',
          message: 'The gym will have modified hours during the upcoming holiday weekend.',
          type: 'announcement',
          priority: 'medium',
          read: true,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          sender: 'Management',
          actionRequired: false
        }
      ];

      // Add role-specific notifications
      if (userRole === 'admin') {
        mockNotifications.push(
          {
            id: '6',
            title: 'Staff Approval Required',
            message: 'New staff member John Smith is waiting for approval.',
            type: 'staff',
            priority: 'high',
            read: false,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            sender: 'System',
            actionRequired: true
          },
          {
            id: '7',
            title: 'Monthly Revenue Report',
            message: 'Monthly revenue report is ready for review.',
            type: 'report',
            priority: 'medium',
            read: false,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            sender: 'System',
            actionRequired: false
          }
        );
      }

      if (userRole === 'staff') {
        mockNotifications.push(
          {
            id: '8',
            title: 'New Member Registration',
            message: 'New member Jane Doe has completed registration.',
            type: 'member',
            priority: 'medium',
            read: false,
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            sender: 'System',
            actionRequired: false
          }
        );
      }

      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b7a';
      case 'medium': return '#feca57';
      case 'low': return '#2ed573';
      default: return '#666';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment': return <AlertCircle size={16} />;
      case 'class': return <Clock size={16} />;
      case 'maintenance': return <Info size={16} />;
      case 'membership': return <CheckCircle size={16} />;
      case 'announcement': return <Bell size={16} />;
      case 'staff': return <AlertCircle size={16} />;
      case 'report': return <Info size={16} />;
      case 'member': return <CheckCircle size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesReadStatus = showRead || !notification.read;
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <div className="error-container">
          <AlertCircle size={48} />
          <p>{error}</p>
          <button onClick={fetchNotifications}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-content">
          <h1>Notifications</h1>
          <p>Stay updated with gym news and important updates</p>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="action-btn" onClick={markAllAsRead}>
              <CheckCircle size={16} />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="type-filters">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="class">Class</option>
              <option value="maintenance">Maintenance</option>
              <option value="membership">Membership</option>
              <option value="announcement">Announcement</option>
              <option value="staff">Staff</option>
              <option value="report">Report</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div className="read-filter">
            <label>
              <input
                type="checkbox"
                checked={showRead}
                onChange={(e) => setShowRead(e.target.checked)}
              />
              Show Read
            </label>
          </div>
        </div>
      </div>

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={64} />
            <h2>No notifications found</h2>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.priority}`}
              >
                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <div className="notification-meta">
                      <span className="sender">{notification.sender}</span>
                      <span className="time">{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-footer">
                    <div className="notification-tags">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      >
                        {notification.priority}
                      </span>
                      <span className="type-badge">{notification.type}</span>
                      {notification.actionRequired && (
                        <span className="action-badge">Action Required</span>
                      )}
                    </div>
                    
                    <div className="notification-actions">
                      {!notification.read && (
                        <button 
                          className="action-btn small"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle size={14} />
                          Mark Read
                        </button>
                      )}
                      <button 
                        className="action-btn small danger"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 