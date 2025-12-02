import axios from 'axios';

// Helper to sanitize API URL
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  // Remove trailing /api or /api/
  return url.replace(/\/api\/?$/, '');
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
