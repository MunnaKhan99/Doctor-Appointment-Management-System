// lib/api.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'https://appointment-manager-node.onrender.com/api/v1'
});

// Request interceptor to add auth token (fallback to localStorage before store init)
api.interceptors.request.use((config) => {
  let token = useAuthStore.getState().token;
  if (!token) {
    try { token = localStorage.getItem('token') || '' } catch { token = '' }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      // Avoid hard reload when possible; let ProtectedRoute handle redirect
      // As a fallback (outside React tree), perform a soft navigation
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        try {
          // Replace without full reload if SPA router picks it up
          window.history.replaceState(null, '', '/login');
        } catch (_err) { void _err }
      }
    }
    return Promise.reject(error);
  }
);

export default api;