// Hebrew labels for values that come from the server in English

export const ROLE_LABELS = {
  customer: 'לקוח',
  agent: 'נציג',
  admin: 'מנהל',
};

export const STATUS_LABELS = {
  open: 'פתוח',
  closed: 'סגור',
};

export const PRIORITY_LABELS = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה',
};

// Unknown values (e.g. a status the admin added) are shown as they are
export const labelOf = (labels, value) => labels[value] || value || '—';

// SQLite returns UTC dates like "2025-01-01 10:00:00"
export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`);
  return date.toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
}
