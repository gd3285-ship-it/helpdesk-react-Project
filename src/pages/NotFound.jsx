import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

// Outside the Layout, so it works for guests and logged in users alike
function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card not-found">
        <div className="auth-brand">
          <Logo size={52} />
        </div>
        <p className="not-found-code">404</p>
        <h1>העמוד לא נמצא</h1>
        <p className="muted">נראה שהקישור שגוי, או שהעמוד הוסר.</p>
        <Link to="/dashboard" className="btn btn-primary btn-block">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
