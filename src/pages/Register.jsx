import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register, clearAuthError, selectAuth } from '../store/authSlice';
import ErrorMessage from '../components/ErrorMessage';
import Logo from '../components/Logo';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function validate({ name, email, password }) {
  if (!name.trim() || !email.trim() || !password) return 'יש למלא את כל השדות';
  if (!EMAIL_PATTERN.test(email.trim())) return 'כתובת האימייל אינה תקינה';
  if (password.length < MIN_PASSWORD_LENGTH)
    return `הסיסמה חייבת להכיל לפחות ${MIN_PASSWORD_LENGTH} תווים`;
  return '';
}

// Registration creates a customer and logs in automatically (see authSlice)
function Register() {
  const dispatch = useDispatch();
  const { status, error } = useSelector(selectAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate(form);
    setFormError(validationError);
    if (validationError) return;
    dispatch(
      register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    );
  };

  const isLoading = status === 'loading';

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-brand">
          <Logo size={52} />
        </div>
        <h1>יצירת חשבון</h1>
        <p className="muted">פתיחת חשבון לקוח חדש ב-Helpdesk</p>

        <ErrorMessage message={formError || error} />

        <label className="field">
          <span>שם מלא</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" />
        </label>

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
            autoComplete="new-password"
            dir="ltr"
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? 'נרשם...' : 'הרשמה'}
        </button>

        <p className="auth-switch">
          כבר יש לך חשבון? <Link to="/login">להתחברות</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
