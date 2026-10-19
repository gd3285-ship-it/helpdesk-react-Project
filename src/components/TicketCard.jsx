import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { formatDate } from '../utils/labels';

// showCreator - agents and admins see who opened the ticket
function TicketCard({ ticket, showCreator }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className={`card ticket-card ticket-card-${ticket.status_name}`}
    >
      <div className="ticket-card-header">
        <span className="ticket-id">#{ticket.id}</span>
        <StatusBadge status={ticket.status_name} />
        <PriorityBadge priority={ticket.priority_name} />
      </div>

      <h3 className="ticket-subject">{ticket.subject}</h3>

      <div className="ticket-meta muted">
        {showCreator && <span>נפתח ע"י: {ticket.created_by_name}</span>}
        <span>מטפל: {ticket.assigned_to_name || 'לא הוקצה'}</span>
        <span>{formatDate(ticket.created_at)}</span>
      </div>
    </Link>
  );
}

export default TicketCard;
