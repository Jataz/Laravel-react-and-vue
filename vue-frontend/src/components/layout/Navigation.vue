<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <nav class="sidebar glass-dark fixed h-full z-50 transition-all duration-300 border-r border-white/10" :class="{ 'collapsed': sidebarCollapsed }">
      <!-- Sidebar Header -->
      <div class="sidebar-header p-6 border-b border-white/10">
        <div class="flex items-center">
          <div class="sidebar-brand flex items-center">
            <div class="brand-icon gradient-secondary rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                 style="width: 48px; height: 48px;">
              <ShieldCheckIcon class="text-white w-6 h-6" />
            </div>
            <div v-if="!sidebarCollapsed" class="brand-text">
              <h1 class="font-bold text-xl text-white">Admin Panel</h1>
              <p class="text-white/60 text-sm">Management System</p>
            </div>
          </div>
          <button 
            class="text-white/80 p-2 ml-auto lg:hidden hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            @click="toggleSidebar"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="sidebar-content flex-grow overflow-auto py-6">
        <div class="px-4 space-y-2">
          <!-- Dashboard -->
          <div class="nav-item">
            <router-link 
              to="/dashboard" 
              class="nav-link group flex items-center rounded-2xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              :class="{ 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20': $route.path === '/dashboard' }"
            >
              <div class="nav-icon-wrapper p-2 rounded-xl bg-white/10 mr-4 group-hover:bg-white/20 transition-all duration-300">
                <HomeIcon class="w-5 h-5" />
              </div>
              <span v-if="!sidebarCollapsed" class="font-medium">Dashboard</span>
              <div v-if="$route.path === '/dashboard'" class="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
            </router-link>
          </div>

          <!-- Users -->
          <div class="nav-item" v-if="hasPermission('view users')">
            <router-link 
              to="/users" 
              class="nav-link group flex items-center rounded-2xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              :class="{ 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20': $route.path === '/users' }"
            >
              <div class="nav-icon-wrapper p-2 rounded-xl bg-white/10 mr-4 group-hover:bg-white/20 transition-all duration-300">
                <UsersIcon class="w-5 h-5" />
              </div>
              <span v-if="!sidebarCollapsed" class="font-medium">Users</span>
              <div v-if="$route.path === '/users'" class="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
            </router-link>
          </div>

          <!-- Roles -->
          <div class="nav-item" v-if="hasPermission('view roles' )">
            <router-link 
              to="/roles" 
              class="nav-link group flex items-center rounded-2xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              :class="{ 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20': $route.path === '/roles' }"
            >
              <div class="nav-icon-wrapper p-2 rounded-xl bg-white/10 mr-4 group-hover:bg-white/20 transition-all duration-300">
                <UserGroupIcon class="w-5 h-5" />
              </div>
              <span v-if="!sidebarCollapsed" class="font-medium">Roles</span>
              <div v-if="$route.path === '/roles'" class="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
            </router-link>
          </div>

          <!-- Permissions -->
          <div class="nav-item" v-if="hasPermission('view permissions')">
            <router-link 
              to="/permissions" 
              class="nav-link group flex items-center rounded-2xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              :class="{ 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20': $route.path === '/permissions' }"
            >
              <div class="nav-icon-wrapper p-2 rounded-xl bg-white/10 mr-4 group-hover:bg-white/20 transition-all duration-300">
                <KeyIcon class="w-5 h-5" />
              </div>
              <span v-if="!sidebarCollapsed" class="font-medium">Permissions</span>
              <div v-if="$route.path === '/permissions'" class="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
            </router-link>
          </div>

          <!-- Profile -->
        </div>
      </div>

      <!-- User Profile Section -->
      <div class="sidebar-footer border-t border-white/10 p-4">
        <div class="relative">
          <button 
            class="w-full text-left flex items-center hover:bg-white/10 rounded-2xl px-4 py-3 transition-all duration-300 group"
            @click="toggleUserMenu"
          >
            <div class="user-avatar gradient-primary rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-105 transition-transform duration-300"
                 style="width: 48px; height: 48px;">
              <UserIcon class="text-white w-5 h-5" />
            </div>
            <div v-if="!sidebarCollapsed" class="flex-grow">
              <div class="font-semibold text-white">{{ user?.name || 'Admin User' }}</div>
              <div class="text-white/60 text-sm">{{ user?.email || 'admin@example.com' }}</div>
            </div>
            <ChevronUpIcon v-if="!sidebarCollapsed && showUserMenu" class="ml-2 w-4 h-4 text-white/60 transition-transform duration-300" />
            <ChevronDownIcon v-if="!sidebarCollapsed && !showUserMenu" class="ml-2 w-4 h-4 text-white/60 transition-transform duration-300" />
          </button>
          
          <!-- User Menu Dropdown -->
          <div v-if="showUserMenu" class="absolute bottom-full left-0 right-0 mb-2 glass rounded-2xl shadow-glass border border-white/20 overflow-hidden animate-slide-up">
            <div class="py-2">
              <a class="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200" href="#" @click.prevent="handleProfile">
                <UserIcon class="mr-3 w-4 h-4" />
                <span class="font-medium">Profile</span>
              </a>
              <a class="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200" href="#" @click.prevent="handleSettings">
                <CogIcon class="mr-3 w-4 h-4" />
                <span class="font-medium">Settings</span>
              </a>
              <div class="border-t border-white/10 my-2"></div>
              <a class="flex items-center px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200" href="#" @click.prevent="handleLogout">
                <ArrowRightOnRectangleIcon class="mr-3 w-4 h-4" />
                <span class="font-medium">Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <div class="main-content flex-grow transition-all duration-300" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Top Header -->
      <header class="header glass backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div class="w-full px-6">
          <div class="flex items-center justify-between py-4">
            <div class="flex items-center">
              <button 
                class="text-gray-700 p-2 mr-4 lg:hidden hover:text-gray-900 hover:bg-white/10 rounded-xl transition-all duration-200"
                @click="toggleSidebar"
              >
                <Bars3Icon class="w-6 h-6" />
              </button>
              <button 
                class="text-gray-700 p-2 mr-4 hidden lg:block hover:text-gray-900 hover:bg-white/10 rounded-xl transition-all duration-200"
                @click="toggleSidebar"
              >
                <Bars3Icon class="w-6 h-6" />
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-800 mb-0">{{ pageTitle }}</h1>
                <p class="text-gray-600 text-sm">{{ pageSubtitle }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
                <!-- Notifications -->
                <div class="relative">
                  <button 
                    class="text-gray-700 p-3 relative hover:text-gray-900 hover:bg-white/10 rounded-2xl transition-all duration-200 group"
                    @click="toggleNotifications"
                  >
                    <BellIcon class="w-5 h-5" />
                    <span class="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                      3
                    </span>
                  </button>
                  <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-glass border border-white/20 z-50 overflow-hidden animate-slide-down">
                    <div class="p-4 border-b border-white/10">
                      <h6 class="font-semibold text-gray-800">Notifications</h6>
                    </div>
                    <div class="py-2">
                      <a class="block px-4 py-3 text-gray-700 hover:bg-white/10 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500" href="#">
                        <div class="font-medium">New user registered</div>
                        <div class="text-sm text-gray-500">2 minutes ago</div>
                      </a>
                      <a class="block px-4 py-3 text-gray-700 hover:bg-white/10 transition-all duration-200 border-l-4 border-transparent hover:border-green-500" href="#">
                        <div class="font-medium">Role permissions updated</div>
                        <div class="text-sm text-gray-500">5 minutes ago</div>
                      </a>
                      <a class="block px-4 py-3 text-gray-700 hover:bg-white/10 transition-all duration-200 border-l-4 border-transparent hover:border-purple-500" href="#">
                        <div class="font-medium">System backup completed</div>
                        <div class="text-sm text-gray-500">1 hour ago</div>
                      </a>
                      <div class="border-t border-white/10 my-2"></div>
                      <a class="block px-4 py-3 text-center text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium" href="#">View all notifications</a>
                    </div>
                  </div>
                </div>

                <!-- User Menu -->
                <div class="relative">
                  <button 
                    class="text-gray-700 p-2 flex items-center hover:text-gray-900 hover:bg-white/10 rounded-2xl transition-all duration-200 group"
                    @click="toggleHeaderUserMenu"
                  >
                    <div class="user-avatar gradient-primary rounded-2xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-105 transition-transform duration-300"
                         style="width: 40px; height: 40px;">
                      <UserIcon class="text-white w-5 h-5" />
                    </div>
                    <div class="hidden md:block text-left">
                      <div class="font-semibold text-gray-800">{{ user?.name || 'Admin User' }}</div>
                      <div class="text-sm text-gray-600">{{ user?.email || 'admin@example.com' }}</div>
                    </div>
                    <ChevronDownIcon class="ml-2 w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
                  </button>
                  <div v-if="showHeaderUserMenu" class="absolute right-0 mt-2 w-56 glass rounded-2xl shadow-glass border border-white/20 z-50 overflow-hidden animate-slide-down">
                    <div class="py-2">
                      <a class="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-white/10 transition-all duration-200" href="#" @click.prevent="handleProfile">
                        <UserIcon class="mr-3 w-4 h-4" />
                        <span class="font-medium">Profile</span>
                      </a>
                      <a class="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-white/10 transition-all duration-200" href="#" @click.prevent="handleSettings">
                        <CogIcon class="mr-3 w-4 h-4" />
                        <span class="font-medium">Settings</span>
                      </a>
                      <div class="border-t border-white/10 my-2"></div>
                      <a class="flex items-center px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200" href="#" @click.prevent="handleLogout">
                        <ArrowRightOnRectangleIcon class="mr-3 w-4 h-4" />
                        <span class="font-medium">Logout</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </header>

      <!-- Page Content -->
      <main class="content p-4">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="showMobileOverlay" 
      class="sidebar-overlay lg:hidden"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  KeyIcon,
  UserIcon,
  BellIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const { user, logout, hasPermission } = useAuth();

const sidebarCollapsed = ref(false);
const showMobileOverlay = ref(false);
const showUserMenu = ref(false);
const showNotifications = ref(false);
const showHeaderUserMenu = ref(false);

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/users': 'User Management',
    '/roles': 'Role Management',
    '/permissions': 'Permission Management'
  };
  return titles[route.path] || 'Admin Panel';
});

const pageSubtitle = computed(() => {
  const subtitles = {
    '/dashboard': 'Overview of your system',
    '/users': 'Manage system users',
    '/roles': 'Manage user roles',
    '/permissions': 'Manage system permissions'
  };
  return subtitles[route.path] || 'Manage your system';
});

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  if (window.innerWidth < 992) {
    showMobileOverlay.value = !sidebarCollapsed.value;
  }
};

const closeSidebar = () => {
  if (window.innerWidth < 992) {
    sidebarCollapsed.value = true;
    showMobileOverlay.value = false;
  }
};

const handleProfile = () => {
  // Navigate to profile page
  router.push('/profile');
};

const handleSettings = () => {
  // Navigate to settings page
  router.push('/settings');
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
  showHeaderUserMenu.value = false;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
  showHeaderUserMenu.value = false;
};

const toggleHeaderUserMenu = () => {
  showHeaderUserMenu.value = !showHeaderUserMenu.value;
  showUserMenu.value = false;
  showNotifications.value = false;
};

const handleResize = () => {
  if (window.innerWidth >= 992) {
    showMobileOverlay.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  // Auto-collapse sidebar on mobile
  if (window.innerWidth < 992) {
    sidebarCollapsed.value = true;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
@reference "../../style.css";

/* Sidebar Styles */
.sidebar {
  width: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

/* Main Content */
.main-content {
  margin-left: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

/* Header Styles */
.header {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

/* Navigation Icons */
.nav-icon-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover .nav-icon-wrapper {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* User Avatar */
.user-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Brand Icon */
.brand-icon {
  min-width: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-icon:hover {
  transform: rotate(5deg) scale(1.05);
}

/* Mobile Responsive */
@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}

/* Hide text when sidebar is collapsed */
.sidebar.collapsed .brand-text,
.sidebar.collapsed span:not(.notification-badge) {
  display: none;
}

.sidebar.collapsed .nav-icon-wrapper {
  margin-right: 0;
}

/* Content Area */
.content {
  background: transparent;
  min-height: calc(100vh - 80px);
}

/* Custom Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-down {
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover Effects */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.nav-link:hover::before {
  left: 100%;
}

/* Scrollbar Styling */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Glass Effect Enhancement */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.shadow-glass {
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

/* Notification Badge Animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>