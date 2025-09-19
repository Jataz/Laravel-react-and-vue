import { ref, computed, onMounted } from 'vue';
import { authAPI } from '../services/api';

// Global state
const user = ref(null);
const loading = ref(true);
const token = ref(localStorage.getItem('token'));

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const isAdmin = () => {
    return user.value?.roles?.some(role => role.name === 'admin') || false;
  };

  const hasPermission = (permission) => {
    if (!user.value) return false;
    
    // Admin has all permissions
    if (isAdmin()) return true;
    
    // Check if user has the specific permission through their roles
    return user.value.roles?.some(role => 
      role.permissions?.some(perm => perm.name === permission)
    ) || false;
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token: userToken } = response.data.data;
      
      user.value = userData;
      token.value = userToken;
      
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token: userToken } = response.data.data;
      
      user.value = newUser;
      token.value = userToken;
      
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || {};
      return { success: false, error: message, errors };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      user.value = null;
      token.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const initAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
      
      // Verify token is still valid
      try {
        const response = await authAPI.profile();
        user.value = response.data.data.user;
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token.value = null;
        user.value = null;
      }
    }
    loading.value = false;
  };

  // Initialize auth on first use
  onMounted(() => {
    if (loading.value) {
      initAuth();
    }
  });

  return {
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    isAdmin,
    hasPermission,
    login,
    register,
    logout,
    initAuth
  };
}