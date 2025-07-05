import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
import './Membership.css';

const Membership = () => {
  const { currentUser } = useAuth();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mock membership data - in real app, this would come from Firestore
  useEffect(() => {
    const mockMembership = {
      id: '1',
      type: 'Premium',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-15'),
      price: 50,
      billingCycle: 'monthly',
      autoRenew: true,
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
      usage: {
        totalVisits: 45,
        thisMonth: 12,
        averagePerWeek: 3.2,
        lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      paymentMethod: {
        type: 'credit_card',
        last4: '1234',
        expiry: '12/25'
      }
    };

    setMembership(mockMembership);
    setLoading(false);
  }, []);

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
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
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
        <div className="loading-spinner"></div>
        <p>Loading membership details...</p>
      </div>
    );
  }

  return (
    <div className="membership-container">
      <div className="membership-header">
        <div className="header-content">
          <h1>My Membership</h1>
          <p>Manage your membership plan and track your fitness journey</p>
        </div>
        <div className="header-actions">
          <button className="action-btn">
            <Download size={20} />
            Download Card
          </button>
          <button className="action-btn">
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>

      <div className="membership-content">
        {/* Current Membership Card */}
        <div className="membership-card">
          <div className="card-header">
            <div className="membership-info">
              <div className="membership-type">
                <Award size={24} />
                <h2>{membership.type} Membership</h2>
              </div>
              <div className="membership-status" style={{ '--status-color': getStatusColor(membership.status) }}>
                <div className="status-dot"></div>
                {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
              </div>
            </div>
            <div className="membership-price">
              <span className="price">${membership.price}</span>
              <span className="billing">/{membership.billingCycle}</span>
            </div>
          </div>

          <div className="membership-progress">
            <div className="progress-info">
              <span>Membership Progress</span>
              <span>{Math.round(getMembershipProgress())}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getMembershipProgress()}%` }}
              ></div>
            </div>
          </div>

          <div className="membership-dates">
            <div className="date-item">
              <Calendar size={16} />
              <div>
                <span className="label">Start Date</span>
                <span className="value">{formatDate(membership.startDate)}</span>
              </div>
            </div>
            <div className="date-item">
              <Clock size={16} />
              <div>
                <span className="label">End Date</span>
                <span className="value">{formatDate(membership.endDate)}</span>
              </div>
            </div>
            <div className="date-item">
              <Target size={16} />
              <div>
                <span className="label">Days Remaining</span>
                <span className="value">{getDaysRemaining()} days</span>
              </div>
            </div>
          </div>

          <div className="membership-features">
            <h3>Your Benefits</h3>
            <div className="features-grid">
              {membership.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <CheckCircle size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="usage-section">
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
                <h3>Avg. per Week</h3>
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

        {/* Payment Information */}
        <div className="payment-section">
          <h2>Payment Information</h2>
          <div className="payment-card">
            <div className="payment-method">
              <div className="method-info">
                <CreditCard size={20} />
                <div>
                  <h3>Payment Method</h3>
                  <p>•••• •••• •••• {membership.paymentMethod.last4}</p>
                  <span>Expires {membership.paymentMethod.expiry}</span>
                </div>
              </div>
              <button className="update-btn">Update</button>
            </div>
            <div className="billing-info">
              <div className="billing-item">
                <span className="label">Billing Cycle</span>
                <span className="value">{membership.billingCycle}</span>
              </div>
              <div className="billing-item">
                <span className="label">Auto Renewal</span>
                <span className="value">{membership.autoRenew ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="billing-item">
                <span className="label">Next Payment</span>
                <span className="value">{formatDate(membership.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        <div className="upgrade-section">
          <h2>Upgrade Your Membership</h2>
          <p>Unlock more features and maximize your fitness potential</p>
          
          <div className="plans-grid">
            {membershipPlans.map(plan => (
              <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && (
                  <div className="popular-badge">
                    <Star size={16} />
                    Most Popular
                  </div>
                )}
                
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">${plan.price}</span>
                    <span className="billing">/{plan.billingCycle}</span>
                  </div>
                </div>

                <div className="plan-features">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <CheckCircle size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`upgrade-btn ${plan.id === membership.type.toLowerCase() ? 'current' : ''}`}
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.id === membership.type.toLowerCase()}
                >
                  {plan.id === membership.type.toLowerCase() ? 'Current Plan' : 'Upgrade Now'}
                </button>
              </div>
            ))}
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