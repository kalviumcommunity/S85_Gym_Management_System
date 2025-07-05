import { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { authData } = useContext(AuthContext);
  const isAuthenticated = authData && allowedRoles.includes(authData.role);

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
