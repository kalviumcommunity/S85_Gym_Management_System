import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { UserPlus } from 'lucide-react';

const PendingSignups = () => {
  return (
    <PlaceholderPage
      title="Pending Signups"
      description="Review and approve new member registrations and manage signup requests."
      icon={UserPlus}
    />
  );
};

export default PendingSignups; 