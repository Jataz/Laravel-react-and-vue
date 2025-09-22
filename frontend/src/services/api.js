import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
const getCacheKey = (url, params = {}) => {
  return `${url}?${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Create axios instance with optimized defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token and handle caching
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache check for GET requests
    if (config.method === 'get') {
      const cacheKey = getCacheKey(config.url, config.params);
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        // Return cached data as a resolved promise
        config.adapter = () => Promise.resolve({
          data: cachedData,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config
        });
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and caching
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.status === 200) {
      const cacheKey = getCacheKey(response.config.url, response.config.params);
      setCachedData(cacheKey, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Optimized API wrapper with concurrent request handling
const createOptimizedAPI = (endpoint) => ({
  getAll: () => api.get(endpoint),
  getById: (id) => api.get(`${endpoint}/${id}`),
  create: (data) => {
    // Clear cache on create
    cache.clear();
    return api.post(endpoint, data);
  },
  update: (id, data) => {
    // Clear cache on update
    cache.clear();
    return api.put(`${endpoint}/${id}`, data);
  },
  delete: (id) => {
    // Clear cache on delete
    cache.clear();
    return api.delete(`${endpoint}/${id}`);
  },
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
};

// Users API with optimizations
export const usersAPI = {
  ...createOptimizedAPI('/users'),
  assignRole: (userId, roleId) => {
    cache.clear();
    return api.post(`/users/${userId}/roles`, { role_id: roleId });
  },
  removeRole: (userId, roleId) => {
    cache.clear();
    return api.delete(`/users/${userId}/roles/${roleId}`);
  },
  assignPermission: (userId, permissionId) => {
    cache.clear();
    return api.post(`/users/${userId}/permissions`, { permission_id: permissionId });
  },
  removePermission: (userId, permissionId) => {
    cache.clear();
    return api.delete(`/users/${userId}/permissions/${permissionId}`);
  },
};

// Roles API with optimizations
export const rolesAPI = {
  ...createOptimizedAPI('/roles'),
  assignPermission: (roleId, permissionId) => {
    cache.clear();
    return api.post(`/roles/${roleId}/permissions`, { permission_id: permissionId });
  },
  removePermission: (roleId, permissionId) => {
    cache.clear();
    return api.delete(`/roles/${roleId}/permissions/${permissionId}`);
  },
};

// Permissions API with optimizations
export const permissionsAPI = createOptimizedAPI('/permissions');

// Utility function for batch requests
export const batchRequests = async (requests) => {
  try {
    const results = await Promise.allSettled(requests);
    return results.map(result => ({
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  } catch (error) {
    console.error('Batch request error:', error);
    return [];
  }
};

// Clear cache utility
export const clearCache = () => {
  cache.clear();
};

export default api;