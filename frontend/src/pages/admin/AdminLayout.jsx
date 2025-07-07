import React from 'react';
import '../admin/AdminPages.css';

const AdminLayout = ({ title, description, icon, actions, children }) => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          {icon && React.cloneElement(icon, { className: 'header-icon' })}
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
        </div>
        {actions && <div className="header-actions">{actions}</div>}
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 