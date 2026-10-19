import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectUser } from '../store/authSlice';
import {
  fetchTicket,
  fetchLookups,
  fetchAgents,
  updateTicket,
  addComment,
  clearActionError,
} from '../store/ticketsSlice';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import TicketManagePanel from '../components/TicketManagePanel';
import { formatDate } from '../utils/labels';

// Server messages for a missing ticket / a ticket the user may not see
const LOAD_ERRORS = {
  'Not found': 'הטיקט לא נמצא',
  Forbidden: 'אין לך הרשאה לצפות בטיקט הזה',
};

function DetailRow({ label, children }) {
  return (
    <div className="detail-row">
      <span className="muted">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function TicketDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { current, currentStatus, currentError, actionStatus, actionError, statuses, agents } =
    useSelector((state) => state.tickets);

  const role = user?.role;
  const canManage = role === 'agent' || role === 'admin';
  const isSaving = actionStatus === 'loading';

  useEffect(() => {
    dispatch(clearActionError());
    dispatch(fetchTicket(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (canManage) dispatch(fetchLookups());
    if (role === 'admin') dispatch(fetchAgents());
  }, [canManage, role, dispatch]);

  const handleUpdate = (changes) => dispatch(updateTicket({ id: current.id, changes }));

  const handleAddComment = async (content) => {
    const result = await dispatch(addComment({ ticketId: current.id, content }));
    return addComment.fulfilled.match(result);
  };

  // 'idle' / another ticket still in the store = this ticket's request hasn't started yet
  const isStale = current && String(current.id) !== id;
  if (currentStatus === 'loading' || currentStatus === 'idle' || isStale) {
    return <Loader text="טוען טיקט..." />;
  }

  if (currentStatus === 'failed') {
    return (
      <EmptyState title={LOAD_ERRORS[currentError] || currentError}>
        <Link to="/tickets" className="btn btn-secondary">
          חזרה לרשימת הטיקטים
        </Link>
      </EmptyState>
    );
  }

  if (!current) return null;

  return (
    <div className="ticket-details">
      <Link to="/tickets" className="back-link">
        → חזרה לרשימה
      </Link>

      <div className="ticket-hero card">
        <div className="ticket-card-header">
          <span className="ticket-id">#{current.id}</span>
          <StatusBadge status={current.status_name} />
          <PriorityBadge priority={current.priority_name} />
        </div>
        <h1 className="ticket-hero-title">{current.subject}</h1>
        <p className="ticket-description">{current.description}</p>
      </div>

      <ErrorMessage message={actionError} />

      <div className="details-layout">
        <section className="card">
          <h2 className="section-title">
            תגובות <span className="count-pill">{current.comments?.length || 0}</span>
          </h2>
          <CommentList comments={current.comments} currentUserId={user?.id} />
          <CommentForm onSubmit={handleAddComment} isSending={isSaving} />
        </section>

        <aside className="details-side">
          <div className="card side-card">
            <h3 className="side-card-title">פרטים</h3>
            <DetailRow label="נפתח ע״י">{current.created_by_name || '—'}</DetailRow>
            <DetailRow label="מטפל">{current.assigned_to_name || 'לא הוקצה'}</DetailRow>
            <DetailRow label="נפתח בתאריך">{formatDate(current.created_at)}</DetailRow>
            {current.updated_at && (
              <DetailRow label="עודכן לאחרונה">{formatDate(current.updated_at)}</DetailRow>
            )}
          </div>

          {canManage && (
            <TicketManagePanel
              ticket={current}
              role={role}
              statuses={statuses}
              agents={agents}
              onUpdate={handleUpdate}
              isSaving={isSaving}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

export default TicketDetails;
