import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import './ErrorPages.css';

const AccessDenied = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <Shield size={80} />
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Please contact your administrator if you believe this is an error.</p>
        <Link to="/dashboard" className="error-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied; 