import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  BarChart3, 
  ShoppingCart, 
  Settings, 
  Bell,
  TrendingUp,
  DollarSign,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import api from '../../axiosConfig';
import './AdminPages.css';

const AdminDashboard = () => {
  const { currentUser, userRole } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    staffUsers: 0,
    expiredMembers: 0,
    pendingPayments: 0,
    monthlyGrowth: '+0%',
    recentMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userRole === 'admin') {
      fetchDashboardStats();
    }
  }, [userRole]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/stats/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const adminFeatures = [
    {
      title: "Manage Staff",
      description: "Approve, reject, and manage staff members",
      icon: Users,
      link: "/staff",
      color: "#00CFFF",
      badge: stats.pendingPayments > 0 ? `${stats.pendingPayments} pending` : null
    },
    {
      title: "Create Staff",
      description: "Add new staff members to your team",
      icon: UserPlus,
      link: "/create-staff",
      color: "#00CFFF"
    },
    {
      title: "Analytics",
      description: "View gym performance and member statistics",
      icon: BarChart3,
      link: "/analytics",
      color: "#feca57"
    },
    {
      title: "Manage Shop",
      description: "Add, edit, and manage shop items",
      icon: ShoppingCart,
      link: "/manage-shop",
      color: "#ff6b7a"
    },
    {
      title: "Services",
      description: "Manage gym services and classes",
      icon: Settings,
      link: "/services",
      color: "#a8e6cf"
    },
    {
      title: "Notifications",
      description: "Send notifications to members and staff",
      icon: Bell,
      link: "/send-notification",
      color: "#ff9ff3"
    }
  ];

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {currentUser?.displayName}! Monitor your gym's performance</p>
          <button onClick={fetchDashboardStats} className="refresh-btn" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh Data
          </button>
        </div>
        {error ? (
          <div className="error-container">
            <AlertCircle size={24} color="#ff4757" />
            <p>{error}</p>
            <button onClick={fetchDashboardStats} className="retry-btn">Retry</button>
          </div>
        ) : (
          <div className="header-stats">
            <div className="stat-card">
              <DollarSign size={24} />
              <div>
                <h3>Monthly Revenue</h3>
                <p>${stats.monthlyRevenue?.toLocaleString() || '0'}</p>
                <small>{stats.recentMembers || 0} new members</small>
              </div>
            </div>
            <div className="stat-card active">
              <Users size={24} />
              <div>
                <h3>Active Members</h3>
                <p>{stats.activeMembers || 0}</p>
                <small>{stats.totalMembers || 0} total members</small>
              </div>
            </div>
            <div className="stat-card growth">
              <TrendingUp size={24} />
              <div>
                <h3>Growth Rate</h3>
                <p>{stats.monthlyGrowth || '+0%'}</p>
                <small>{stats.staffUsers || 0} staff members</small>
              </div>
            </div>
            <div className="stat-card pending">
              <Activity size={24} />
              <div>
                <h3>System Health</h3>
                <p>{stats.expiredMembers > 0 ? `${stats.expiredMembers} expired` : 'All Good'}</p>
                <small>{stats.pendingPayments || 0} pending payments</small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-content">
        <div className="features-grid">
          {adminFeatures.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link} 
              className="feature-card"
              style={{ '--accent-color': feature.color }}
            >
              <div className="feature-icon">
                <feature.icon size={32} />
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.badge && (
                  <span className="feature-badge">{feature.badge}</span>
                )}
              </div>
              <div className="feature-arrow">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 