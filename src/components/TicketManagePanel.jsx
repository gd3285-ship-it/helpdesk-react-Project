import { useEffect, useState } from 'react';
import { STATUS_LABELS, labelOf } from '../utils/labels';

// Agent/admin: change status. Admin only: assign the ticket to an agent.
function TicketManagePanel({ ticket, role, statuses, agents, onUpdate, isSaving }) {
  const [statusId, setStatusId] = useState(String(ticket.status_id ?? ''));
  const [assignedTo, setAssignedTo] = useState(String(ticket.assigned_to ?? ''));

  // Keep the selects in sync after a successful update
  useEffect(() => {
    setStatusId(String(ticket.status_id ?? ''));
    setAssignedTo(String(ticket.assigned_to ?? ''));
  }, [ticket.status_id, ticket.assigned_to]);

  const statusChanged = statusId !== String(ticket.status_id ?? '');
  const assignChanged = assignedTo !== String(ticket.assigned_to ?? '');

  return (
    <div className="card side-card">
      <h3 className="side-card-title">ניהול הטיקט</h3>

      <div className="field">
        <span>סטטוס</span>
        <div className="field-row">
          <select value={statusId} onChange={(e) => setStatusId(e.target.value)} disabled={isSaving}>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {labelOf(STATUS_LABELS, status.name)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!statusChanged || isSaving}
            onClick={() => onUpdate({ status_id: Number(statusId) })}
          >
            עדכון
          </button>
        </div>
      </div>

      {role === 'admin' && (
        <div className="field">
          <span>הקצאה לנציג</span>
          <div className="field-row">
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={isSaving}
            >
              <option value="" disabled>
                בחרו נציג
              </option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!assignChanged || !assignedTo || isSaving}
              onClick={() => onUpdate({ assigned_to: Number(assignedTo) })}
            >
              הקצאה
            </button>
          </div>
          {agents.length === 0 && <small className="muted">אין נציגים במערכת</small>}
        </div>
      )}
    </div>
  );
}

export default TicketManagePanel;
