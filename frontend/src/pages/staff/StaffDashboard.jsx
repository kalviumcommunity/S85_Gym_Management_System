import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { Users } from 'lucide-react';

const StaffDashboard = () => {
  return (
    <PlaceholderPage
      title="Staff Dashboard"
      description="Manage members, view check-ins, and handle daily gym operations."
      icon={Users}
    />
  );
};

export default StaffDashboard; 