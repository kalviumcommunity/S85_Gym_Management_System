import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Clock, 
  Award,
  DollarSign,
  Target,
  User,
  ShoppingBag,
  Bell,
  UserPlus,
  ShoppingCart
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Only redirect if we're on the main dashboard and user has a specific role
    if (location.pathname === '/dashboard' && userRole) {
      if (userRole === 'member') {
        navigate('/dashboard/member');
      } else if (userRole === 'staff') {
        navigate('/dashboard/staff');
      } else if (userRole === 'admin') {
        navigate('/dashboard/admin');
      }
    }
  }, [userRole, navigate, location.pathname]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleSpecificStats = () => {
    switch (userRole) {
      case 'member':
        return [
          { title: 'Membership Status', value: 'Active', icon: Award, color: '#00CFFF' },
          { title: 'Days Remaining', value: '45 days', icon: Calendar, color: '#2ed573' },
          { title: 'Last Workout', value: '2 days ago', icon: Activity, color: '#feca57' },
          { title: 'Total Workouts', value: '12', icon: Target, color: '#a55eea' }
        ];
      case 'staff':
        return [
          { title: 'Total Members', value: '156', icon: Users, color: '#00CFFF' },
          { title: 'Active Members', value: '142', icon: Activity, color: '#2ed573' },
          { title: 'Pending Payments', value: '8', icon: DollarSign, color: '#feca57' },
          { title: 'Today\'s Check-ins', value: '23', icon: Clock, color: '#a55eea' }
        ];
      case 'admin':
        return [
          { title: 'Total Revenue', value: '$45,230', icon: DollarSign, color: '#00CFFF' },
          { title: 'Active Members', value: '156', icon: Users, color: '#2ed573' },
          { title: 'Monthly Growth', value: '+12%', icon: TrendingUp, color: '#feca57' },
          { title: 'Staff Members', value: '8', icon: Award, color: '#a55eea' }
        ];
      default:
        return [];
    }
  };

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {currentUser.displayName}!</h1>
          <p>Welcome to your {userRole} dashboard</p>
        </div>
        <div className="user-info">
          <img 
            src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=00CFFF&color=fff&size=100`} 
            alt="Profile" 
            className="user-avatar"
          />
          <div className="user-details">
            <span className="user-name">{currentUser.displayName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {getRoleSpecificStats().map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ '--accent-color': stat.color }}>
              <div className="stat-icon">
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {/* Member Actions */}
          {userRole === 'member' && (
            <>
              <button className="action-btn" onClick={() => navigate('/membership')}>
                <Award size={20} />
                View Membership
              </button>
              <button className="action-btn" onClick={() => navigate('/payments')}>
                <DollarSign size={20} />
                Pay Fees
              </button>
              <button className="action-btn" onClick={() => navigate('/profile')}>
                <User size={20} />
                Edit Profile
              </button>
              <button className="action-btn" onClick={() => navigate('/shop')}>
                <ShoppingBag size={20} />
                Browse Shop
              </button>
              <button className="action-btn" onClick={() => navigate('/notifications')}>
                <Bell size={20} />
                Notifications
              </button>
            </>
          )}
          
          {/* Staff Actions */}
          {userRole === 'staff' && (
            <>
              <button className="action-btn" onClick={() => navigate('/members')}>
                <Users size={20} />
                View Members
              </button>
              <button className="action-btn" onClick={() => navigate('/profile')}>
                <User size={20} />
                Edit Profile
              </button>
              <button className="action-btn" onClick={() => navigate('/notifications')}>
                <Bell size={20} />
                Notifications
              </button>
              <button className="action-btn" onClick={() => navigate('/shop')}>
                <ShoppingBag size={20} />
                Browse Shop
              </button>
            </>
          )}
          
          {/* Admin Actions */}
          {userRole === 'admin' && (
            <>
              <button className="action-btn" onClick={() => navigate('/staff')}>
                <Users size={20} />
                Manage Staff
              </button>
              <button className="action-btn" onClick={() => navigate('/create-staff')}>
                <UserPlus size={20} />
                Add Staff
              </button>
              <button className="action-btn" onClick={() => navigate('/analytics')}>
                <TrendingUp size={20} />
                View Analytics
              </button>
              <button className="action-btn" onClick={() => navigate('/manage-shop')}>
                <ShoppingCart size={20} />
                Manage Shop
              </button>
              <button className="action-btn" onClick={() => navigate('/profile')}>
                <User size={20} />
                Edit Profile
              </button>
              <button className="action-btn" onClick={() => navigate('/notifications')}>
                <Bell size={20} />
                Notifications
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 