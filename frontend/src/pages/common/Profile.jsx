import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { User } from 'lucide-react';

const Profile = () => {
  return (
    <PlaceholderPage
      title="Profile"
      description="Manage your profile information, update settings, and view your account details."
      icon={User}
    />
  );
};

export default Profile; 