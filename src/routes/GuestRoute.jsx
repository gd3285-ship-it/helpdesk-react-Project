import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsLoggedIn } from '../store/authSlice';

// Login/register pages - a logged in user goes to the page they asked for before, or /dashboard
function GuestRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();

  if (isLoggedIn) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}

export default GuestRoute;
