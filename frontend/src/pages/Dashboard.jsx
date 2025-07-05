import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Dashboard = () => {
  const { authData } = useContext(AuthContext);

  if (!authData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your Dashboard, {authData.name}</h1>
      {authData.role === 'admin' ? (
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
