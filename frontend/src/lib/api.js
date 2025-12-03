import axios from 'axios';

// Helper to sanitize API URL
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  console.log('[API] Raw VITE_API_URL:', url);

  // Trim whitespace
  url = url.trim();

  // Remove trailing /api or /api/ (case insensitive)
  // Also handles multiple occurrences like /api/api just in case
  while (/\/api\/?$/i.test(url)) {
    url = url.replace(/\/api\/?$/i, '');
  }

  // Ensure no trailing slash
  url = url.replace(/\/$/, '');

  console.log('[API] Sanitized API_URL:', url);
  return url;
};

export const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
