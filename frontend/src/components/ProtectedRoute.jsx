import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, AlertCircle } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, userRole, userStatus, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Handle pending staff members
  if (userRole === 'pending_staff') {
    return (
      <div className="pending-approval-container">
        <div className="pending-approval-content">
          <div className="pending-icon">
            <Clock size={80} />
          </div>
          <h1>Account Pending Approval</h1>
          <p>Your staff account is waiting for admin approval.</p>
          <p>You will be notified once your account is approved.</p>
          <div className="pending-info">
            <p><strong>Status:</strong> Pending Staff Approval</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="logout-btn"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Handle suspended/inactive users
  if (userStatus === 'suspended' || userStatus === 'inactive') {
    return (
      <div className="suspended-container">
        <div className="suspended-content">
          <div className="suspended-icon">
            <AlertCircle size={80} />
          </div>
          <h1>Account Suspended</h1>
          <p>Your account has been suspended or is inactive.</p>
          <p>Please contact the administrator for assistance.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="logout-btn"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute; 