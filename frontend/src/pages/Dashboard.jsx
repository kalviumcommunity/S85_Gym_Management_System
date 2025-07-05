import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your Dashboard, {currentUser.displayName || 'User'}</h1>
      {userRole === 'admin' ? (
        <div>
          <h2>Admin Panel</h2>
          <p>Manage users and settings here.</p>
        </div>
      ) : (
        <div>
          <h2>Staff Panel</h2>
          <p>Manage gym members and assist with operations.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
