import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://shelfex-backend.onrender.com'
  : process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Socket.io instance
export let socket: Socket | null = null; // Export the socket instance

export const initializeSocket = (token: string) => {
  if (!socket) {
    socket = io(API_URL, {
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Auth API calls
export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: { firstName: string; lastName: string }) =>
    api.put('/auth/profile', data),
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Jobs API calls
export const jobs = {
  getAll: () => api.get('/jobs'),
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: {
    company: string;
    role: string;
    status: string;
    appliedDate: string;
    notes: string;
  }) => api.post('/jobs', data),
  update: (
    id: string,
    data: {
      company?: string;
      role?: string;
      status?: string;
      appliedDate?: string;
      notes?: string;
    }
  ) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
};

// User API calls (Admin Panel)
export const users = {
  getAllUsers: () => api.get('/users'),
  updateUserRole: (id: string, role: 'admin' | 'applicant') =>
    api.put(`/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export default api; 