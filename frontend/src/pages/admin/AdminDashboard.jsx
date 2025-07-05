import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <PlaceholderPage
      title="Admin Dashboard"
      description="Manage gym operations, view analytics, and control system settings."
      icon={Settings}
    />
  );
};

export default AdminDashboard; 