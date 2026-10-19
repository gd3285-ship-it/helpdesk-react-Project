// "No data" message, with an optional action (e.g. a link to create a ticket)
function EmptyState({ title = 'אין נתונים להצגה', children }) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      {children}
    </div>
  );
}

export default EmptyState;
