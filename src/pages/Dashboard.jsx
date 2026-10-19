import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectUser } from '../store/authSlice';
import { fetchTickets } from '../store/ticketsSlice';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import TicketCard from '../components/TicketCard';
import { ROLE_LABELS } from '../utils/labels';

const RECENT_COUNT = 5;

const ROLE_INTRO = {
  customer: 'כאן אפשר לפתוח פניות חדשות ולעקוב אחרי הפניות שלך.',
  agent: 'כאן מופיעות הפניות שהוקצו לך לטיפול.',
  admin: 'כאן מופיעות כל הפניות במערכת, וניתן להקצות אותן לנציגים.',
};

// tone picks the card's accent color (see .stat-* in index.css)
function StatCard({ label, value, tone = 'primary' }) {
  return (
    <div className={`card stat-card stat-${tone}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

// The server already returns only the tickets this role may see
function Dashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const { items, listStatus, listError } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const role = user?.role;
  const openCount = items.filter((t) => t.status_name === 'open').length;
  const closedCount = items.filter((t) => t.status_name === 'closed').length;
  const unassignedCount = items.filter((t) => !t.assigned_to).length;

  return (
    <div>
      {location.state?.forbidden && (
        <ErrorMessage message="אין לך הרשאה לעמוד שניסית להיכנס אליו" />
      )}

      <div className="page-header welcome-banner">
        <div>
          <h1>שלום, {user?.name} 👋</h1>
          <p className="muted">
            {ROLE_LABELS[role]} · {ROLE_INTRO[role]}
          </p>
        </div>
        {role === 'customer' && (
          <Link to="/tickets/new" className="btn btn-primary">
            + פתיחת טיקט חדש
          </Link>
        )}
      </div>

      {listStatus === 'loading' && <Loader />}
      <ErrorMessage message={listError} />

      {listStatus === 'succeeded' && (
        <>
          <div className="stats-grid">
            <StatCard label={role === 'agent' ? 'הוקצו לך' : 'סה"כ טיקטים'} value={items.length} />
            <StatCard label="פתוחים" value={openCount} tone="success" />
            <StatCard label="סגורים" value={closedCount} tone="neutral" />
            {role === 'admin' && (
              <StatCard label="ממתינים להקצאה" value={unassignedCount} tone="warning" />
            )}
          </div>

          <div className="section-header">
            <h2>טיקטים אחרונים</h2>
            {items.length > 0 && <Link to="/tickets">לכל הטיקטים ←</Link>}
          </div>

          {items.length === 0 ? (
            <EmptyState title="אין עדיין טיקטים">
              {role === 'customer' && <Link to="/tickets/new">לפתיחת הטיקט הראשון</Link>}
            </EmptyState>
          ) : (
            <div className="tickets-grid">
              {items.slice(0, RECENT_COUNT).map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} showCreator={role !== 'customer'} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
