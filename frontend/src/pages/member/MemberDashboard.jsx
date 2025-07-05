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
    { title: 'Membership Status', value: stats.membershipStatus || 'Active', icon: Award, color: '#00CFFF' },
    { title: 'Days Remaining', value: stats.daysRemaining || '45 days', icon: Calendar, color: '#2ed573' },
    { title: 'Last Workout', value: stats.lastWorkout || '2 days ago', icon: Activity, color: '#feca57' },
    { title: 'Total Workouts', value: stats.totalWorkouts?.toString() || '12', icon: Target, color: '#a55eea' },
    { title: 'Monthly Fee', value: '$50', icon: DollarSign, color: '#ff6b7a' },
    { title: 'Next Payment', value: '15 days', icon: Clock, color: '#00CFFF' }
  ];

  const recentActivities = [
    { activity: 'Cardio Session', time: '2 days ago', duration: '45 min' },
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