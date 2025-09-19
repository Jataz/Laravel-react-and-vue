import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

// Import components (we'll create these next)
import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: () => import('../views/UserManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiredPermission: 'view users'
    }
  },
  {
    path: '/roles',
    name: 'RoleManagement',
    component: () => import('../views/RoleManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiredPermission: 'view roles'
    }
  },
  {
    path: '/permissions',
    name: 'PermissionManagement',
    component: () => import('../views/PermissionManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiredPermission: 'view permissions'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, hasPermission, loading, initAuth } = useAuth();
  
  // Wait for auth initialization if still loading
  if (loading.value) {
    await initAuth();
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next({ name: 'Dashboard' });
    return;
  }
  
  // Check if route requires specific permission
  if (to.meta.requiredPermission && !hasPermission(to.meta.requiredPermission)) {
    // Redirect to dashboard with error message
    next({ name: 'Dashboard', query: { error: 'insufficient_permissions' } });
    return;
  }
  
  next();
});

export default router;