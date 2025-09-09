import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Activity, 
  Target, 
  Award,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react';
import api from '../../axiosConfig';
import './MemberPages.css';

const MemberDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemberStats();
  }, []);

  const fetchMemberStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching member stats:', err);
      setError('Failed to load member statistics');
    } finally {
      setLoading(false);
    }
  };

  const memberStats = [
    { 
      title: 'Membership Status', 
      value: stats.membershipStatus || 'Unknown', 
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

  const recentActivities = [
    { activity: 'Cardio Session', time: stats.lastWorkout || '2 days ago', duration: '45 min' },
    { activity: 'Strength Training', time: '4 days ago', duration: '60 min' },
    { activity: 'Yoga Class', time: '1 week ago', duration: '30 min' },
    { activity: 'Swimming', time: '1 week ago', duration: '30 min' }
  ];

  if (loading) {
    return (
      <div className="member-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="member-dashboard">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchMemberStats}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="member-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {currentUser?.displayName}!</h1>
          <p>Track your fitness journey and stay motivated</p>
          {stats.membershipStatus && (
            <div className="membership-status">
              <span className={`status-badge ${stats.membershipStatus}`}>
                {stats.membershipStatus}
              </span>
            </div>
          )}
        </div>
        <div className="user-info">
          <img 
            src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || 'User')}&background=00CFFF&color=fff&size=100`} 
            alt="Profile" 
            className="user-avatar"
            onError={(e) => {
              console.error('MemberDashboard image failed to load:', e.target.src);
              // Try fallback to generated avatar if original failed
              if (currentUser?.displayName && e.target.src !== `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=00CFFF&color=fff&size=100`) {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=00CFFF&color=fff&size=100`;
              } else {
                // Final fallback to default avatar
                e.target.src = '/default-avatar.svg';
              }
            }}
            onLoad={(e) => {
              console.log('MemberDashboard image loaded successfully:', e.target.src);
            }}
          />
          <div className="user-details">
            <span className="user-name">{currentUser?.displayName}</span>
            <span className="user-role">Member</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {memberStats.map((stat, index) => {
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

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <h4>{activity.activity}</h4>
                    <p>{activity.time}</p>
                  </div>
                  <div className="activity-duration">
                    <Clock size={16} />
                    <span>{activity.duration}</span>
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

export default MemberDashboard; 