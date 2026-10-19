import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, selectUser } from '../store/authSlice';
import { ROLE_LABELS } from '../utils/labels';
import Logo from './Logo';

function Navbar() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Logo size={34} />
        <span>Helpdesk</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard">לוח בקרה</NavLink>
        <NavLink to="/tickets" end>
          טיקטים
        </NavLink>
        {user?.role === 'customer' && <NavLink to="/tickets/new">טיקט חדש</NavLink>}
      </nav>

      <div className="navbar-user">
        <div className="navbar-user-info">
          <span className="navbar-user-name">{user?.name}</span>
          <span className={`role-tag role-${user?.role}`}>{ROLE_LABELS[user?.role]}</span>
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          התנתקות
        </button>
      </div>
    </header>
  );
}

export default Navbar;
