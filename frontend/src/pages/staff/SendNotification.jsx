import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { MessageSquare } from 'lucide-react';

const SendNotification = () => {
  return (
    <PlaceholderPage
      title="Send Notification"
      description="Send notifications to members, create announcements, and manage communications."
      icon={MessageSquare}
    />
  );
};

export default SendNotification; 