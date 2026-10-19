import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../store/authSlice';
import { fetchTickets, fetchLookups } from '../store/ticketsSlice';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import TicketCard from '../components/TicketCard';
import { STATUS_LABELS, labelOf } from '../utils/labels';

const PAGE_TITLES = {
  customer: 'הטיקטים שלי',
  agent: 'טיקטים שהוקצו אליי',
  admin: 'כל הטיקטים',
};

function TicketsList() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { items, listStatus, listError, statuses } = useSelector((state) => state.tickets);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchLookups());
  }, [dispatch]);

  const role = user?.role;
  const filtered =
    statusFilter === 'all' ? items : items.filter((t) => String(t.status_id) === statusFilter);

  return (
    <div>
      <div className="page-header">
        <h1>{PAGE_TITLES[role]}</h1>
        {role === 'customer' && (
          <Link to="/tickets/new" className="btn btn-primary">
            + טיקט חדש
          </Link>
        )}
      </div>

      <div className="toolbar">
        <label className="field field-inline">
          <span>סינון לפי סטטוס</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">הכל</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {labelOf(STATUS_LABELS, status.name)}
              </option>
            ))}
          </select>
        </label>
        {listStatus === 'succeeded' && (
          <span className="muted">
            מוצגים {filtered.length} מתוך {items.length}
          </span>
        )}
      </div>

      {listStatus === 'loading' && <Loader text="טוען טיקטים..." />}

      {listStatus === 'failed' && (
        <>
          <ErrorMessage message={listError} />
          <button type="button" className="btn btn-secondary" onClick={() => dispatch(fetchTickets())}>
            נסה שוב
          </button>
        </>
      )}

      {listStatus === 'succeeded' &&
        (filtered.length === 0 ? (
          <EmptyState title={items.length === 0 ? 'אין טיקטים להצגה' : 'אין טיקטים בסטטוס הזה'}>
            {role === 'customer' && items.length === 0 && (
              <Link to="/tickets/new">לפתיחת טיקט חדש</Link>
            )}
          </EmptyState>
        ) : (
          <div className="tickets-grid">
            {filtered.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} showCreator={role !== 'customer'} />
            ))}
          </div>
        ))}
    </div>
  );
}

export default TicketsList;
