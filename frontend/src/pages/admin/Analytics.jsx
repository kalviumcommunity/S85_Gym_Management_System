import React from 'react';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';
import './AdminPages.css';

const Analytics = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          <BarChart3 size={32} className="header-icon" />
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Comprehensive insights and performance metrics</p>
          </div>
        </div>
      </div>

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
                <p className="metric-value">1,247</p>
                <p className="metric-change positive">+12% this month</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Activity size={24} />
              </div>
              <div className="metric-content">
                <h3>Active Members</h3>
                <p className="metric-value">892</p>
                <p className="metric-change positive">+8% this month</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <TrendingUp size={24} />
              </div>
              <div className="metric-content">
                <h3>Revenue</h3>
                <p className="metric-value">$45,230</p>
                <p className="metric-change positive">+15% this month</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <BarChart3 size={24} />
              </div>
              <div className="metric-content">
                <h3>Avg. Check-ins</h3>
                <p className="metric-value">3.2/week</p>
                <p className="metric-change negative">-2% this month</p>
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
              <div className="chart-placeholder">
                <BarChart3 size={48} />
                <p>Member growth chart will be displayed here</p>
              </div>
            </div>

            <div className="chart-card">
              <h3>Revenue Trends</h3>
              <div className="chart-placeholder">
                <TrendingUp size={48} />
                <p>Revenue trends chart will be displayed here</p>
              </div>
            </div>

            <div className="chart-card">
              <h3>Attendance Patterns</h3>
              <div className="chart-placeholder">
                <Activity size={48} />
                <p>Attendance patterns chart will be displayed here</p>
              </div>
            </div>

            <div className="chart-card">
              <h3>Equipment Usage</h3>
              <div className="chart-placeholder">
                <BarChart3 size={48} />
                <p>Equipment usage chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon positive">
                <Users size={16} />
              </div>
              <div className="activity-content">
                <p><strong>New member registered:</strong> John Doe</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon positive">
                <TrendingUp size={16} />
              </div>
              <div className="activity-content">
                <p><strong>Payment received:</strong> $99.99 from Jane Smith</p>
                <span className="activity-time">4 hours ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon neutral">
                <Activity size={16} />
              </div>
              <div className="activity-content">
                <p><strong>Equipment maintenance:</strong> Treadmill #3 serviced</p>
                <span className="activity-time">6 hours ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon negative">
                <Users size={16} />
              </div>
              <div className="activity-content">
                <p><strong>Membership expired:</strong> Mike Johnson</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 