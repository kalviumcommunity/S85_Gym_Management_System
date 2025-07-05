import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import './ErrorPages.css';

const NotFound = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <Search size={80} />
        </div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p>Check the URL or go back to the dashboard.</p>
        <Link to="/dashboard" className="error-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 