import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import './PlaceholderPage.css';

const PlaceholderPage = ({ title, description, icon: Icon = Construction }) => {
  return (
    <div className="placeholder-container">
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <Icon size={80} />
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>This feature is coming soon!</p>
        <Link to="/dashboard" className="placeholder-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderPage; 