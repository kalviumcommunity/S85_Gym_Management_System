import { useAuth } from '../context/AuthContext';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { currentUser, userRole } = useAuth();
  const isAuthenticated = currentUser && allowedRoles.includes(userRole);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
};

export default PrivateRoute;
