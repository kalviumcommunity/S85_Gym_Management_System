import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Filter,
  Search,
  Trash2,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  Wrench,
  Award,
  Megaphone,
  Users,
  BarChart3,
  User
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const { currentUser, userRole } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRead, setShowRead] = useState(true);

  // Mock notifications data - in real app, this would come from Firestore
  useEffect(() => {
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
    setLoading(false);
  }, [userRole]);

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
      case 'low': return '#00CFFF';
      default: return '#666';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment': return <DollarSign size={16} />;
      case 'class': return <Calendar size={16} />;
      case 'maintenance': return <Wrench size={16} />;
      case 'membership': return <Award size={16} />;
      case 'announcement': return <Megaphone size={16} />;
      case 'staff': return <Users size={16} />;
      case 'report': return <BarChart3 size={16} />;
      case 'member': return <User size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadStatus = showRead || !notification.read;
    
    return matchesFilter && matchesSearch && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-content">
          <h1>Notifications</h1>
          <p>Stay updated with important messages and updates</p>
        </div>
        <div className="header-actions">
          <button 
            className="mark-all-read-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle size={20} />
            Mark All Read
          </button>
        </div>
      </div>

      <div className="notifications-content">
        <div className="filters-section">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-dropdown">
              <Filter size={16} />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="payment">Payment</option>
                <option value="class">Class</option>
                <option value="maintenance">Maintenance</option>
                <option value="membership">Membership</option>
                <option value="announcement">Announcement</option>
                {userRole === 'admin' && (
                  <>
                    <option value="staff">Staff</option>
                    <option value="report">Report</option>
                  </>
                )}
                {userRole === 'staff' && (
                  <option value="member">Member</option>
                )}
              </select>
            </div>

            <button 
              className={`toggle-read-btn ${showRead ? 'active' : ''}`}
              onClick={() => setShowRead(!showRead)}
            >
              {showRead ? <Eye size={16} /> : <EyeOff size={16} />}
              {showRead ? 'Show All' : 'Unread Only'}
            </button>
          </div>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} />
              <h3>No notifications found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.priority}`}
              >
                <div className="notification-priority" style={{ backgroundColor: getPriorityColor(notification.priority) }}></div>
                
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
                  
                  {notification.actionRequired && (
                    <div className="action-required">
                      <AlertCircle size={16} />
                      <span>Action Required</span>
                    </div>
                  )}
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="action-btn read-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 