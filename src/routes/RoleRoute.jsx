import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser } from '../store/authSlice';

// Logged in but the role is not allowed -> back to /dashboard
function RoleRoute({ allowedRoles }) {
  const user = useSelector(selectUser);

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace state={{ forbidden: true }} />;
  }
  return <Outlet />;
}

export default RoleRoute;
