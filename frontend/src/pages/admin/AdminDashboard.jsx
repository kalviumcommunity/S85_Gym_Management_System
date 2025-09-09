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
  Activity
} from 'lucide-react';
import './AdminPages.css';

const AdminDashboard = () => {
  const { getAllStaffMembers } = useAuth();
  const [stats, setStats] = useState({
    totalStaff: 0,
    pendingStaff: 0,
    activeStaff: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const staffMembers = await getAllStaffMembers();
      setStats({
        totalStaff: staffMembers.length,
        pendingStaff: staffMembers.filter(m => m.role === 'pending_staff').length,
        activeStaff: staffMembers.filter(m => m.role === 'staff').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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
      badge: stats.pendingStaff > 0 ? `${stats.pendingStaff} pending` : null
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
          <p>Manage your gym operations and monitor performance</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <h3>Total Staff</h3>
              <p>{stats.totalStaff}</p>
            </div>
          </div>
          <div className="stat-card pending">
            <Activity size={24} />
            <div>
              <h3>Pending Approval</h3>
              <p>{stats.pendingStaff}</p>
            </div>
          </div>
          <div className="stat-card active">
            <TrendingUp size={24} />
            <div>
              <h3>Active Staff</h3>
              <p>{stats.activeStaff}</p>
            </div>
          </div>
        </div>
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