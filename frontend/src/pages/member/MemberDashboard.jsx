import React from 'react';
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
import './MemberPages.css';

const MemberDashboard = () => {
  const { currentUser } = useAuth();

  const memberStats = [
    { title: 'Membership Status', value: 'Active', icon: Award, color: '#00CFFF' },
    { title: 'Days Remaining', value: '45 days', icon: Calendar, color: '#2ed573' },
    { title: 'Last Workout', value: '2 days ago', icon: Activity, color: '#feca57' },
    { title: 'Total Workouts', value: '12', icon: Target, color: '#a55eea' },
    { title: 'Monthly Fee', value: '$50', icon: DollarSign, color: '#ff6b7a' },
    { title: 'Next Payment', value: '15 days', icon: Clock, color: '#00CFFF' }
  ];

  const recentActivities = [
    { activity: 'Cardio Session', time: '2 days ago', duration: '45 min' },
    { activity: 'Strength Training', time: '4 days ago', duration: '60 min' },
    { activity: 'Yoga Class', time: '1 week ago', duration: '30 min' },
    { activity: 'Swimming', time: '1 week ago', duration: '30 min' }
  ];

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

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-list">
              <button className="action-btn">
                <Calendar size={20} />
                Book a Class
              </button>
              <button className="action-btn">
                <DollarSign size={20} />
                Pay Fees
              </button>
              <button className="action-btn">
                <Activity size={20} />
                Log Workout
              </button>
              <button className="action-btn">
                <Target size={20} />
                Set Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard; 