import api from './axios';

// The server filters by role: customer - own tickets, agent - assigned to them, admin - all
export const getTicketsRequest = () => api.get('/tickets').then((res) => res.data);

// Returns the ticket together with its comments array
export const getTicketRequest = (id) => api.get(`/tickets/${id}`).then((res) => res.data);

// Customer only. Body: { subject, description, priority_id? }
export const createTicketRequest = (ticket) =>
  api.post('/tickets', ticket).then((res) => res.data);

// Agent/admin. Body: { status_id?, priority_id?, assigned_to? (admin only) }
export const updateTicketRequest = (id, changes) =>
  api.patch(`/tickets/${id}`, changes).then((res) => res.data);

export const getCommentsRequest = (ticketId) =>
  api.get(`/tickets/${ticketId}/comments`).then((res) => res.data);

export const addCommentRequest = (ticketId, content) =>
  api.post(`/tickets/${ticketId}/comments`, { content }).then((res) => res.data);

export const getStatusesRequest = () => api.get('/statuses').then((res) => res.data);

export const getPrioritiesRequest = () => api.get('/priorities').then((res) => res.data);
