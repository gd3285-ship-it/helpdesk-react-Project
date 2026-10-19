import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { login, clearAuthError, selectAuth } from '../store/authSlice';
import ErrorMessage from '../components/ErrorMessage';
import Logo from '../components/Logo';

// After a successful login GuestRoute redirects to the requested page or /dashboard
function Login() {
  const dispatch = useDispatch();
  const { status, error } = useSelector(selectAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setFormError('יש למלא אימייל וסיסמה');
      return;
    }
    setFormError('');
    dispatch(login({ email: form.email.trim(), password: form.password }));
  };

  const isLoading = status === 'loading';

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-brand">
          <Logo size={52} />
        </div>
        <h1>ברוכים השבים</h1>
        <p className="muted">התחברו למערכת ה-Helpdesk</p>

        <ErrorMessage message={formError || error} />

        <label className="field">
          <span>אימייל</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            dir="ltr"
          />
        </label>

        <label className="field">
          <span>סיסמה</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            dir="ltr"
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? 'מתחבר...' : 'התחברות'}
        </button>

        <p className="auth-switch">
          אין לך חשבון? <Link to="/register">להרשמה</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
