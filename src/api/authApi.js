import api from './axios';

// Returns { token, user: { id, name, email, role, ... } }
export const loginRequest = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

// The server always creates a customer and returns only { id } (no token)
export const registerRequest = (name, email, password) =>
  api.post('/auth/register', { name, email, password }).then((res) => res.data);

// Returns { id, name, email, role }
export const getMeRequest = () => api.get('/auth/me').then((res) => res.data);
