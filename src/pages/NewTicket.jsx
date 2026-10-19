import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createTicket, fetchLookups, clearActionError } from '../store/ticketsSlice';
import ErrorMessage from '../components/ErrorMessage';
import { PRIORITY_LABELS, labelOf } from '../utils/labels';

const SUBJECT_MAX = 120;
const MIN_LENGTH = 3;

function validate({ subject, description }) {
  if (!subject.trim() || !description.trim()) return 'יש למלא נושא ותיאור';
  if (subject.trim().length < MIN_LENGTH) return `הנושא חייב להכיל לפחות ${MIN_LENGTH} תווים`;
  if (description.trim().length < MIN_LENGTH) return `התיאור חייב להכיל לפחות ${MIN_LENGTH} תווים`;
  return '';
}

// Customer only (guarded by RoleRoute in App.jsx)
function NewTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { priorities, actionStatus, actionError } = useSelector((state) => state.tickets);
  const [form, setForm] = useState({ subject: '', description: '', priority_id: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(clearActionError());
    dispatch(fetchLookups());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(form);
    setFormError(validationError);
    if (validationError) return;

    const ticket = { subject: form.subject.trim(), description: form.description.trim() };
    // Without a priority the server uses its default
    if (form.priority_id) ticket.priority_id = Number(form.priority_id);

    const result = await dispatch(createTicket(ticket));
    if (createTicket.fulfilled.match(result)) {
      navigate(`/tickets/${result.payload.id}`);
    }
  };

  const isSaving = actionStatus === 'loading';

  return (
    <div className="form-page">
      <Link to="/tickets" className="back-link">
        → חזרה לרשימה
      </Link>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <h1>פתיחת טיקט חדש</h1>
        <p className="muted">תארו את הבעיה, ונציג יחזור אליכם בהקדם</p>

        <ErrorMessage message={formError || actionError} />

        <label className="field">
          <span>נושא</span>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            maxLength={SUBJECT_MAX}
            placeholder="לדוגמה: לא מצליח להתחבר לחשבון"
          />
          <small className="field-hint">
            {form.subject.length}/{SUBJECT_MAX}
          </small>
        </label>

        <label className="field">
          <span>תיאור</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="מה קרה? מה ניסיתם לעשות? מתי זה התחיל?"
          />
        </label>

        <label className="field">
          <span>עדיפות</span>
          <select name="priority_id" value={form.priority_id} onChange={handleChange}>
            <option value="">ברירת מחדל</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {labelOf(PRIORITY_LABELS, priority.name)}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <Link to="/tickets" className="btn btn-secondary">
            ביטול
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'שולח...' : 'פתיחת טיקט'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTicket;
