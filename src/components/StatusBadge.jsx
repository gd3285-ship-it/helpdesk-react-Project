import { STATUS_LABELS, PRIORITY_LABELS, labelOf } from '../utils/labels';

export function StatusBadge({ status }) {
  return <span className={`badge badge-status-${status}`}>{labelOf(STATUS_LABELS, status)}</span>;
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge badge-priority-${priority}`}>
      עדיפות {labelOf(PRIORITY_LABELS, priority)}
    </span>
  );
}
