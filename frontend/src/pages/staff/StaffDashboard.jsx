import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Calendar, 
  Activity, 
  Clock, 
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../../axiosConfig';
import './StaffPages.css';

const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingPayments: 0,
    todayCheckins: 0,
    thisWeekCheckins: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const staffStats = [
    { title: 'Total Members', value: stats.totalMembers.toString(), icon: Users, color: '#00CFFF' },
    { title: 'Active Members', value: stats.activeMembers.toString(), icon: Activity, color: '#2ed573' },
    { title: 'Pending Payments', value: stats.pendingPayments.toString(), icon: DollarSign, color: '#feca57' },
    { title: 'Today\'s Check-ins', value: stats.todayCheckins.toString(), icon: Clock, color: '#a55eea' },
    { title: 'This Week', value: stats.thisWeekCheckins.toString(), icon: Calendar, color: '#ff6b7a' },
    { title: 'Monthly Revenue', value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: Target, color: '#00CFFF' }
  ];

  const recentActivities = [
    { member: 'John Doe', activity: 'Checked in', time: '2 minutes ago', status: 'success' },
    { member: 'Jane Smith', activity: 'Payment overdue', time: '15 minutes ago', status: 'warning' },
    { member: 'Mike Johnson', activity: 'New membership', time: '1 hour ago', status: 'success' },
    { member: 'Sarah Wilson', activity: 'Equipment issue', time: '2 hours ago', status: 'warning' },
    { member: 'Tom Brown', activity: 'Checked out', time: '3 hours ago', status: 'success' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-dashboard">
        <div className="error-container">
          <AlertCircle size={48} />
          <p>{error}</p>
          <button onClick={fetchDashboardStats}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {currentUser?.displayName}!</h1>
          <p>Manage gym operations and assist members</p>
        </div>
        <div className="staff-info">
          <div className="staff-badge">
            <Users size={20} />
            <span>Staff Member</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {staffStats.map((stat, index) => {
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
                  <div className="activity-status">
                    {activity.status === 'success' ? (
                      <CheckCircle size={16} className="success-icon" />
                    ) : (
                      <AlertCircle size={16} className="warning-icon" />
                    )}
                  </div>
                  <div className="activity-info">
                    <h4>{activity.member}</h4>
                    <p>{activity.activity}</p>
                  </div>
                  <div className="activity-time">
                    <Clock size={14} />
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-tasks">
            <h2>Quick Tasks</h2>
            <div className="tasks-list">
              <div className="task-item">
                <div className="task-icon">
                  <Users size={20} />
                </div>
                <div className="task-content">
                  <h4>Check Member Status</h4>
                  <p>Review pending memberships and payments</p>
                </div>
                <div className="task-badge">{stats.pendingPayments} pending</div>
              </div>
              <div className="task-item">
                <div className="task-icon">
                  <Activity size={20} />
                </div>
                <div className="task-content">
                  <h4>Equipment Check</h4>
                  <p>Inspect gym equipment and report issues</p>
                </div>
                <div className="task-badge">1 issue</div>
              </div>
              <div className="task-item">
                <div className="task-icon">
                  <Calendar size={20} />
                </div>
                <div className="task-content">
                  <h4>Class Schedule</h4>
                  <p>Update class schedules and instructor assignments</p>
                </div>
                <div className="task-badge">Updated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 