import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { Award } from 'lucide-react';

const Membership = () => {
  return (
    <PlaceholderPage
      title="My Membership"
      description="View your membership details, plan information, and renewal options."
      icon={Award}
    />
  );
};

export default Membership; 