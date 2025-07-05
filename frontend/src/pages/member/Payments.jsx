import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { CreditCard } from 'lucide-react';

const Payments = () => {
  return (
    <PlaceholderPage
      title="Payment History"
      description="View your payment history, manage billing information, and make payments."
      icon={CreditCard}
    />
  );
};

export default Payments; 