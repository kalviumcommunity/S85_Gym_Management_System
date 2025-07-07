import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
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
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '../../axiosConfig';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

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

  useEffect(() => {
    if (userRole) {
      console.log('🔄 useEffect triggered - userRole:', userRole);
      fetchDashboardStats();
    } else {
      console.log('⏳ useEffect triggered but userRole is null/undefined');
    }
  }, [userRole]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔍 Fetching dashboard stats for user role:', userRole);
      console.log('🔍 Current user:', currentUser?.email);
      
      const response = await api.get('/stats/dashboard');
      console.log('✅ Dashboard stats received:', response.data);
      setStats(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('❌ Error fetching dashboard stats:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    try {
      console.log('🧪 Testing authentication...');
      const response = await api.get('/test-auth');
      console.log('✅ Auth test successful:', response.data);
      alert('Authentication test successful! Check console for details.');
    } catch (err) {
      console.error('❌ Auth test failed:', err);
      alert('Authentication test failed! Check console for details.');
    }
  };

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
          { 
            title: 'Membership Status', 
            value: stats.membershipStatus || 'Active', 
            icon: Award, 
            color: stats.membershipStatus === 'active' ? '#2ed573' : 
                   stats.membershipStatus === 'expired' ? '#ff4757' : '#feca57',
            subtitle: stats.membershipType || 'Unknown Plan'
          },
          { 
            title: 'Days Remaining', 
            value: stats.daysRemaining || '0 days', 
            icon: Calendar, 
            color: '#00CFFF',
            subtitle: `Next payment: ${stats.nextPaymentDate || 'N/A'}`
          },
          { 
            title: 'Last Workout', 
            value: stats.lastWorkout || 'Never', 
            icon: Activity, 
            color: '#feca57',
            subtitle: `${stats.totalWorkouts || 0} total workouts`
          },
          { 
            title: 'Membership Progress', 
            value: `${stats.progressPercentage || 0}%`, 
            icon: Target, 
            color: '#a55eea',
            subtitle: `Value: $${stats.membershipValue || 0}/month`
          }
        ];
      case 'staff':
        return [
          { 
            title: 'Total Members', 
            value: stats.totalMembers?.toString() || '0', 
            icon: Users, 
            color: '#00CFFF',
            subtitle: `${stats.myMembers || 0} managed by you`
          },
          { 
            title: 'Active Members', 
            value: stats.activeMembers?.toString() || '0', 
            icon: Activity, 
            color: '#2ed573',
            subtitle: `${stats.inactiveMembers || 0} inactive`
          },
          { 
            title: 'Pending Payments', 
            value: stats.pendingPayments?.toString() || '0', 
            icon: DollarSign, 
            color: '#feca57',
            subtitle: `Revenue: $${stats.myRevenue || 0}`
          },
          { 
            title: 'Today\'s Check-ins', 
            value: stats.todayCheckins?.toString() || '0', 
            icon: Clock, 
            color: '#a55eea',
            subtitle: `${stats.thisWeekCheckins || 0} this week`
          }
        ];
      case 'admin':
        return [
          { 
            title: 'Total Revenue', 
            value: `$${stats.monthlyRevenue?.toLocaleString() || '0'}`, 
            icon: DollarSign, 
            color: '#00CFFF',
            subtitle: `${stats.recentMembers || 0} new members this month`
          },
          { 
            title: 'Active Members', 
            value: stats.activeMembers?.toString() || '0', 
            icon: Users, 
            color: '#2ed573',
            subtitle: `${stats.totalMembers || 0} total members`
          },
          { 
            title: 'Monthly Growth', 
            value: stats.monthlyGrowth || '+0%', 
            icon: TrendingUp, 
            color: '#feca57',
            subtitle: `${stats.staffUsers || 0} staff members`
          },
          { 
            title: 'System Health', 
            value: stats.expiredMembers ? `${stats.expiredMembers} expired` : 'All Good', 
            icon: Award, 
            color: stats.expiredMembers > 0 ? '#ff4757' : '#a55eea',
            subtitle: `${stats.pendingPayments || 0} pending payments`
          }
        ];
      default:
        return [];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color="#2ed573" />;
      case 'expired':
        return <XCircle size={16} color="#ff4757" />;
      case 'inactive':
        return <AlertCircle size={16} color="#feca57" />;
      default:
        return <AlertCircle size={16} color="#feca57" />;
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <AlertCircle size={48} color="#ff4757" />
          <h3>Failed to Load Dashboard</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardStats} className="retry-btn">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {currentUser.displayName}!</h1>
          <p>Welcome to your {userRole} dashboard</p>
          {lastUpdated && (
            <small className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </small>
          )}
        </div>
        <div className="user-info">
          <img 
            src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=00CFFF&color=fff&size=100`} 
            alt="Profile" 
            className="user-avatar"
            onError={(e) => {
              console.error('Dashboard image failed to load:', e.target.src);
              // Try fallback to generated avatar if original failed
              if (currentUser?.displayName && e.target.src !== `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=00CFFF&color=fff&size=100`) {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=00CFFF&color=fff&size=100`;
              } else {
                // Final fallback to default avatar
                e.target.src = '/default-avatar.svg';
              }
            }}
            onLoad={(e) => {
              console.log('Dashboard image loaded successfully:', e.target.src);
            }}
          />
          <div className="user-details">
            <span className="user-name">{currentUser.displayName}</span>
            <span className="user-role">{userRole}</span>
            {userRole === 'member' && stats.membershipStatus && (
              <div className="status-indicator">
                {getStatusIcon(stats.membershipStatus)}
                <span>{stats.membershipStatus}</span>
              </div>
            )}
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
                {stat.subtitle && (
                  <p className="stat-subtitle">{stat.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="quick-actions">
        <div className="actions-header">
          <h2>Quick Actions</h2>
          <button onClick={fetchDashboardStats} className="refresh-btn" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
          <button onClick={testAuth} className="test-btn" style={{ marginLeft: '10px' }}>
            Test Auth
          </button>
        </div>
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