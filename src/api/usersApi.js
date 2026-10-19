import api from './axios';

// Admin only - used to pick an agent when assigning a ticket
export const getUsersRequest = () => api.get('/users').then((res) => res.data);
