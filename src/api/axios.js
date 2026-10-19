import axios from 'axios';

export const TOKEN_KEY = 'helpdesk_token';

// All requests go through the Vite proxy (/api -> http://localhost:4000)
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Called once from main.jsx: on 401 (expired/invalid token) log the user out.
// Receives the store from outside to avoid a circular import with the store.
export function setupInterceptors(store, onUnauthorized) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (error.response?.status === 401 && !isLoginRequest) {
        store.dispatch(onUnauthorized());
      }
      return Promise.reject(error);
    }
  );
}

// Turns an axios error into a readable message for the UI
export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response) return `שגיאת שרת (${error.response.status})`;
  if (error.request) return 'אין חיבור לשרת. ודאי שהשרת רץ על פורט 4000';
  return error.message || 'שגיאה לא צפויה';
}

export default api;
