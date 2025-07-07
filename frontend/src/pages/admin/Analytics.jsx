import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity, 
  DollarSign,
  Calendar,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import api from '../../axiosConfig';
import './AdminPages.css';
import AdminLayout from './AdminLayout';

const Analytics = () => {
  const { currentUser } = useAuth();
  const [analyticsData, setAnalyticsData] = useState({
    members: {},
    revenue: {},
    attendance: {},
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch analytics data from API
      const response = await api.get(`/analytics?range=${timeRange}`);
      // Defensive: ensure the response has the expected structure
      const data = response.data;
      setAnalyticsData({
        members: data.members || {},
        revenue: data.revenue || {},
        attendance: data.attendance || {},
        activities: Array.isArray(data.activities) ? data.activities : []
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Access denied or server error.');
      // Fallback to mock data
      setAnalyticsData({
        members: {
          total: 1247,
          active: 892,
          new: 45,
          expired: 12,
          growth: 12
        },
        revenue: {
          total: 45230,
          monthly: 12500,
          growth: 15,
          average: 89
        },
        attendance: {
          total: 3240,
          average: 3.2,
          peak: 'Monday 6-8 PM',
          growth: -2
        },
        activities: [
          {
            id: 1,
            type: 'new_member',
            title: 'New member registered',
            description: 'John Doe',
            time: '2 hours ago',
            status: 'positive'
          },
          {
            id: 2,
            type: 'payment',
            title: 'Payment received',
            description: '$99.99 from Jane Smith',
            time: '4 hours ago',
            status: 'positive'
          },
          {
            id: 3,
            type: 'maintenance',
            title: 'Equipment maintenance',
            description: 'Treadmill #3 serviced',
            time: '6 hours ago',
            status: 'neutral'
          },
          {
            id: 4,
            type: 'expired',
            title: 'Membership expired',
            description: 'Mike Johnson',
            time: '1 day ago',
            status: 'negative'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'positive': return <CheckCircle size={16} />;
      case 'negative': return <XCircle size={16} />;
      case 'neutral': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'positive': return '#2ed573';
      case 'negative': return '#ff6b7a';
      case 'neutral': return '#feca57';
      default: return '#a4b0be';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <AdminLayout title="Analytics Dashboard" description="Comprehensive insights and performance metrics" icon={<BarChart3 />}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Analytics Dashboard" description="Comprehensive insights and performance metrics" icon={<BarChart3 />}>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchAnalyticsData}>Retry</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Analytics Dashboard"
      description="Comprehensive insights and performance metrics"
      icon={<BarChart3 />}
      actions={
        <>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="refresh-btn" onClick={fetchAnalyticsData}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </>
      }
    >
      <div className="analytics-grid">
        {/* Key Metrics Cards */}
        <div className="metrics-section">
          <h2>Key Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <Users size={24} />
              </div>
              <div className="metric-content">
                <h3>Total Members</h3>
                <span className="metric-value">{formatNumber(analyticsData.members.total)}</span>
                <span className={`metric-change ${analyticsData.members.growth >= 0 ? 'positive' : 'negative'}`}>{analyticsData.members.growth}%</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Activity size={24} />
              </div>
              <div className="metric-content">
                <h3>Active Members</h3>
                <p className="metric-value">{formatNumber(analyticsData.members.active)}</p>
                <p className="metric-subtitle">
                  {((analyticsData.members.active / analyticsData.members.total) * 100).toFixed(1)}% active rate
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <DollarSign size={24} />
              </div>
              <div className="metric-content">
                <h3>Revenue</h3>
                <p className="metric-value">{formatCurrency(analyticsData.revenue.total)}</p>
                <p className={`metric-change ${analyticsData.revenue.growth >= 0 ? 'positive' : 'negative'}`}>
                  {analyticsData.revenue.growth >= 0 ? '+' : ''}{analyticsData.revenue.growth}% this {timeRange}
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Target size={24} />
              </div>
              <div className="metric-content">
                <h3>Avg. Check-ins</h3>
                <p className="metric-value">{analyticsData.attendance.average}/week</p>
                <p className={`metric-change ${analyticsData.attendance.growth >= 0 ? 'positive' : 'negative'}`}>
                  {analyticsData.attendance.growth >= 0 ? '+' : ''}{analyticsData.attendance.growth}% this {timeRange}
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Award size={24} />
              </div>
              <div className="metric-content">
                <h3>New Members</h3>
                <p className="metric-value">{analyticsData.members.new}</p>
                <p className="metric-subtitle">This {timeRange}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Clock size={24} />
              </div>
              <div className="metric-content">
                <h3>Peak Hours</h3>
                <p className="metric-value">{analyticsData.attendance.peak}</p>
                <p className="metric-subtitle">Busiest time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <h2>Performance Charts</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Member Growth</h3>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <BarChart3 size={48} />
                  <p>Member growth chart will be displayed here</p>
                  <div className="chart-stats">
                    <div className="stat-item">
                      <span className="stat-label">New:</span>
                      <span className="stat-value">{analyticsData.members.new}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Expired:</span>
                      <span className="stat-value">{analyticsData.members.expired}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Revenue Trends</h3>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <TrendingUp size={48} />
                  <p>Revenue trends chart will be displayed here</p>
                  <div className="chart-stats">
                    <div className="stat-item">
                      <span className="stat-label">Monthly:</span>
                      <span className="stat-value">{formatCurrency(analyticsData.revenue.monthly)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{formatCurrency(analyticsData.revenue.average)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Attendance Patterns</h3>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <Activity size={48} />
                  <p>Attendance patterns chart will be displayed here</p>
                  <div className="chart-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total:</span>
                      <span className="stat-value">{formatNumber(analyticsData.attendance.total)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Peak:</span>
                      <span className="stat-value">{analyticsData.attendance.peak}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Membership Distribution</h3>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <Users size={48} />
                  <p>Membership distribution chart will be displayed here</p>
                  <div className="chart-stats">
                    <div className="stat-item">
                      <span className="stat-label">Active:</span>
                      <span className="stat-value">{analyticsData.members.active}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Inactive:</span>
                      <span className="stat-value">{analyticsData.members.total - analyticsData.members.active}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {analyticsData.activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div 
                  className="activity-icon"
                  style={{ color: getStatusColor(activity.status) }}
                >
                  {getStatusIcon(activity.status)}
                </div>
                <div className="activity-content">
                  <p><strong>{activity.title}:</strong> {activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <Users size={20} />
              <span>Export Member Data</span>
            </button>
            <button className="action-btn">
              <DollarSign size={20} />
              <span>Generate Revenue Report</span>
            </button>
            <button className="action-btn">
              <Activity size={20} />
              <span>View Attendance Report</span>
            </button>
            <button className="action-btn">
              <BarChart3 size={20} />
              <span>Download Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics; 