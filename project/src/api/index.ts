import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('threadspire_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Thread endpoints
export const threads = {
  getAll: () => api.get('/threads'),
  getById: (id: string) => api.get(`/threads/${id}`),
  create: (data: any) => api.post('/threads', data),
  update: (id: string, data: any) => api.put(`/threads/${id}`, data),
  delete: (id: string) => api.delete(`/threads/${id}`),
};

// Collection endpoints
export const collections = {
  getAll: (userId: string) => api.get('/collections', { params: { userId } }),
  create: (userId: string, data: any) => 
    api.post('/collections', data, { params: { userId } }),
};

// Bookmark endpoints
export const bookmarks = {
  add: (userId: string, threadId: string) =>
    api.post('/bookmarks', null, { params: { userId, threadId } }),
  getForUser: (userId: string) =>
    api.get('/bookmarks', { params: { userId } }),
};

// Analytics endpoints
export const analytics = {
  getUserAnalytics: (userId: string) =>
    api.get(`/analytics/user/${userId}`),
};

// Fork endpoints
export const forks = {
  forkThread: (userId: string, data: any) =>
    api.post('/forks', data, { params: { userId } }),
};

export default api;