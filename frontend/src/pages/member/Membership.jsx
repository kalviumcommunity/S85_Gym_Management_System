import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Award, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  X,
  RefreshCw,
  Star,
  Users,
  Activity,
  Target,
  CreditCard,
  Download,
  Share2
} from 'lucide-react';
import api from '../../axiosConfig';
import './Membership.css';

const Membership = () => {
  const { currentUser } = useAuth();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      
      if (!currentUser || !currentUser.email) {
        setError('User not authenticated');
        return;
      }

      // Encode the email for URL safety
      const encodedEmail = encodeURIComponent(currentUser.email);
      console.log('Fetching membership for email:', currentUser.email);
      console.log('Encoded email:', encodedEmail);
      const response = await api.get(`/membership/${encodedEmail}`);
      console.log('Membership response:', response.data);
      
      setMembership(response.data);
    } catch (err) {
      console.error('Error fetching membership data:', err);
      if (err.response?.status === 404) {
        setError('No membership found for this account');
      } else {
        setError('Failed to load membership information');
      }
    } finally {
      setLoading(false);
    }
  };

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 30,
      billingCycle: 'monthly',
      features: [
        'Access to gym facilities',
        'Basic equipment usage',
        'Locker room access',
        'Free parking'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 40,
      billingCycle: 'monthly',
      features: [
        'Access to gym facilities',
        'Group fitness classes',
        'Locker room access',
        'Towel service',
        'Guest passes (1/month)'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 50,
      billingCycle: 'monthly',
      features: [
        'Access to all gym facilities',
        'Group fitness classes',
        'Personal training sessions (2/month)',
        'Locker room access',
        'Towel service',
        'Guest passes (2/month)',
        'Fitness assessment (quarterly)',
        'Nutrition consultation (monthly)'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 75,
      billingCycle: 'monthly',
      features: [
        'Access to all gym facilities',
        'Unlimited group fitness classes',
        'Personal training sessions (4/month)',
        'Locker room access',
        'Towel service',
        'Guest passes (4/month)',
        'Fitness assessment (monthly)',
        'Nutrition consultation (weekly)',
        'Spa access',
        'Priority booking'
      ],
      popular: false
    }
  ];

  const getDaysRemaining = () => {
    if (!membership) return 0;
    const now = new Date();
    const end = new Date(membership.endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getMembershipProgress = () => {
    if (!membership) return 0;
    const start = new Date(membership.startDate);
    const end = new Date(membership.endDate);
    const now = new Date();
    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#2ed573';
      case 'expired': return '#ff6b7a';
      case 'pending': return '#feca57';
      default: return '#666';
    }
  };

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    // In real app, this would update Firestore and handle payment
    console.log('Upgrading to:', selectedPlan);
    setShowUpgradeModal(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="membership-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading membership...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="membership-container">
        <div className="error-container">
          <X size={48} />
          <p>{error}</p>
          <button onClick={fetchMembershipData}>Retry</button>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="membership-container">
        <div className="no-membership">
          <Award size={64} />
          <h2>No Active Membership</h2>
          <p>You don't have an active membership in our system. This could be because:</p>
          <ul style={{ textAlign: 'left', margin: '20px 0', paddingLeft: '20px' }}>
            <li>Your membership hasn't been added to the system yet</li>
            <li>Your email address doesn't match the one in our membership database</li>
            <li>You need to contact the gym staff to set up your membership</li>
          </ul>
          <p><strong>Current email:</strong> {currentUser?.email}</p>
          <button className="cta-btn" onClick={() => setShowUpgradeModal(true)}>
            <Star size={20} />
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="membership-container">
      <div className="membership-header">
        <div className="header-content">
          <h1>Membership Details</h1>
          <p>Manage your gym membership and track your progress</p>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={() => setShowUpgradeModal(true)}>
            <RefreshCw size={16} />
            Upgrade Plan
          </button>
          <button className="action-btn">
            <Download size={16} />
            Download Card
          </button>
          <button className="action-btn">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      <div className="membership-content">
        <div className="membership-overview">
          <div className="overview-card">
            <div className="card-header">
              <div className="membership-badge">
                <Award size={24} />
                <span>{membership.type}</span>
              </div>
              <div className="status-indicator">
                <span className={`status ${membership.status}`}>
                  {membership.status === 'active' ? <CheckCircle size={16} /> : <X size={16} />}
                  {membership.status}
                </span>
              </div>
            </div>
            
            <div className="membership-details">
              <div className="detail-row">
                <span className="label">Plan Type:</span>
                <span className="value">{membership.type}</span>
              </div>
              <div className="detail-row">
                <span className="label">Billing Cycle:</span>
                <span className="value">{membership.billingCycle}</span>
              </div>
              <div className="detail-row">
                <span className="label">Monthly Fee:</span>
                <span className="value">${membership.price}</span>
              </div>
              <div className="detail-row">
                <span className="label">Start Date:</span>
                <span className="value">{formatDate(membership.startDate)}</span>
              </div>
              <div className="detail-row">
                <span className="label">End Date:</span>
                <span className="value">{formatDate(membership.endDate)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Auto Renew:</span>
                <span className="value">{membership.autoRenew ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="membership-progress">
              <div className="progress-header">
                <h3>Membership Progress</h3>
                <span className="days-remaining">{getDaysRemaining()} days remaining</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getMembershipProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="membership-features">
          <h2>Your Benefits</h2>
          <div className="features-grid">
            {membership.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <CheckCircle size={20} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="usage-stats">
          <h2>Usage Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Visits</h3>
                <p className="stat-value">{membership.usage.totalVisits}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <h3>This Month</h3>
                <p className="stat-value">{membership.usage.thisMonth}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Target size={24} />
              </div>
              <div className="stat-content">
                <h3>Avg. Per Week</h3>
                <p className="stat-value">{membership.usage.averagePerWeek}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <h3>Last Visit</h3>
                <p className="stat-value">{formatDate(membership.usage.lastVisit)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-info">
          <h2>Payment Information</h2>
          <div className="payment-card">
            <div className="payment-method">
              <div className="method-icon">
                <CreditCard size={24} />
              </div>
              <div className="method-details">
                <h3>Payment Method</h3>
                <p>•••• •••• •••• {membership.paymentMethod.last4}</p>
                <span className="expiry">Expires {membership.paymentMethod.expiry}</span>
              </div>
            </div>
            <button className="update-btn">
              Update Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="modal-overlay">
          <div className="upgrade-modal">
            <div className="modal-header">
              <h2>Upgrade to {selectedPlan.name}</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowUpgradeModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="plan-comparison">
                <div className="current-plan">
                  <h3>Current Plan</h3>
                  <p>{membership.type} - ${membership.price}/{membership.billingCycle}</p>
                </div>
                <div className="arrow">
                  <RefreshCw size={24} />
                </div>
                <div className="new-plan">
                  <h3>New Plan</h3>
                  <p>{selectedPlan.name} - ${selectedPlan.price}/{selectedPlan.billingCycle}</p>
                </div>
              </div>
              
              <div className="upgrade-benefits">
                <h3>New Benefits You'll Get:</h3>
                <ul>
                  {selectedPlan.features.filter(feature => 
                    !membership.features.includes(feature)
                  ).map((feature, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={confirmUpgrade}
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership; 