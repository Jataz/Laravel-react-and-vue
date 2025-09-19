import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  assignRole: (userId, roleId) => api.post(`/users/${userId}/roles`, { role_id: roleId }),
  removeRole: (userId, roleId) => api.delete(`/users/${userId}/roles/${roleId}`),
  assignPermission: (userId, permissionId) => api.post(`/users/${userId}/permissions`, { permission_id: permissionId }),
  removePermission: (userId, permissionId) => api.delete(`/users/${userId}/permissions/${permissionId}`),
};

// Roles API
export const rolesAPI = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (roleData) => api.post('/roles', roleData),
  update: (id, roleData) => api.put(`/roles/${id}`, roleData),
  delete: (id) => api.delete(`/roles/${id}`),
  assignPermission: (roleId, permissionId) => api.post(`/roles/${roleId}/permissions`, { permission_id: permissionId }),
  removePermission: (roleId, permissionId) => api.delete(`/roles/${roleId}/permissions/${permissionId}`),
};

// Permissions API
export const permissionsAPI = {
  getAll: () => api.get('/permissions'),
  getById: (id) => api.get(`/permissions/${id}`),
  create: (permissionData) => api.post('/permissions', permissionData),
  update: (id, permissionData) => api.put(`/permissions/${id}`, permissionData),
  delete: (id) => api.delete(`/permissions/${id}`),
};

export default api;