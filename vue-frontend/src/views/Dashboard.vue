<template>
  <Navigation>
    <div class="dashboard min-h-screen relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <!-- Header Section -->
      <div class="relative glass backdrop-blur-xl border-b border-white/20 px-6 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard</h1>
                  <p class="text-gray-600">Welcome back, <span class="font-semibold text-gray-800">{{ user?.name || 'Admin' }}</span>! Here's your system overview.</p>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="hidden md:flex items-center space-x-3 glass px-4 py-3 rounded-2xl border border-white/20 shadow-glass">
                <div class="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                <span class="text-sm font-semibold text-gray-700">System Online</span>
                <div class="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">99.9%</div>
              </div>
              <button class="gradient-primary hover:scale-105 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <PlusIcon class="w-5 h-5" />
                <span>Quick Action</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative max-w-7xl mx-auto px-6 py-8 space-y-8">

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <!-- Total Users Card -->
          <div class="group glass backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-glass hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div class="space-y-3">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Users</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{{ stats.totalUsers.toLocaleString() }}</p>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                    <ArrowUpIcon class="w-3 h-3 text-green-600" />
                    <span class="text-xs text-green-700 font-bold">+{{ stats.userGrowth }}%</span>
                  </div>
                  <span class="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UsersIcon class="w-8 h-8 text-white" />
              </div>
            </div>
            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style="width: 75%"></div>
            </div>
          </div>

          <!-- Active Roles Card -->
          <div class="group glass backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-glass hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div class="space-y-3">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Roles</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{{ stats.totalRoles }}</p>
                <div class="flex items-center space-x-2">
                  <div class="text-xs text-gray-500">{{ stats.activeRoles }} currently active</div>
                </div>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon class="w-8 h-8 text-white" />
              </div>
            </div>
            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse" style="width: 60%"></div>
            </div>
          </div>

          <!-- Permissions Card -->
          <div class="group glass backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-glass hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div class="space-y-3">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Permissions</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{{ stats.totalPermissions }}</p>
                <div class="flex items-center space-x-2">
                  <div class="text-xs text-gray-500">System-wide permissions</div>
                </div>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <KeyIcon class="w-8 h-8 text-white" />
              </div>
            </div>
            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse" style="width: 90%"></div>
            </div>
          </div>

          <!-- Recent Activity Card -->
          <div class="group glass backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-glass hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div class="space-y-3">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Recent Activity</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">{{ stats.recentActivity }}</p>
                <div class="flex items-center space-x-2">
                  <div class="text-xs text-gray-500">Actions in last 24h</div>
                </div>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ClockIcon class="w-8 h-8 text-white" />
              </div>
            </div>
            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse" style="width: 85%"></div>
            </div>
          </div>
        </div>

        <!-- Main Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Quick Actions -->
          <div class="lg:col-span-1">
            <div class="glass backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-glass">
              <div class="flex items-center space-x-3 mb-8">
                <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Quick Actions</h3>
              </div>
              <div class="space-y-4">
                <button 
                  v-if="hasPermission('users.create')"
                  class="group relative overflow-hidden w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  @click="navigateTo('/users')"
                >
                  <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative flex items-center space-x-4">
                    <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <UserPlusIcon class="w-6 h-6" />
                    </div>
                    <div class="text-left">
                      <div class="font-bold text-white">Add New User</div>
                      <div class="text-sm text-blue-100">Create user account</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  v-if="hasPermission('roles.create')"
                  class="group relative overflow-hidden w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  @click="navigateTo('/roles')"
                >
                  <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative flex items-center space-x-4">
                    <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <PlusIcon class="w-6 h-6" />
                    </div>
                    <div class="text-left">
                      <div class="font-bold text-white">Create Role</div>
                      <div class="text-sm text-green-100">Define new role</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  v-if="hasPermission('users.view')"
                  class="group relative overflow-hidden w-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  @click="navigateTo('/users')"
                >
                  <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative flex items-center space-x-4">
                    <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <UsersIcon class="w-6 h-6" />
                    </div>
                    <div class="text-left">
                      <div class="font-bold text-white">Manage Users</div>
                      <div class="text-sm text-purple-100">View all users</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  v-if="hasPermission('permissions.view')"
                  class="group relative overflow-hidden w-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  @click="navigateTo('/permissions')"
                >
                  <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative flex items-center space-x-4">
                    <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CogIcon class="w-6 h-6" />
                    </div>
                    <div class="text-left">
                      <div class="font-bold text-white">System Settings</div>
                      <div class="text-sm text-orange-100">Configure system</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="lg:col-span-2">
            <div class="glass backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-glass">
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <ClockIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Recent Activity</h3>
                </div>
                <button class="glass px-4 py-2 rounded-xl border border-white/20 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-glass">
                  View All
                </button>
              </div>
              <div class="space-y-4">
                <div 
                  v-for="activity in recentActivities" 
                  :key="activity.id"
                  class="group glass backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300" :class="activity.iconClass">
                        <component :is="activity.icon" class="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0 space-y-2">
                      <p class="text-sm font-bold text-gray-900">{{ activity.description }}</p>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p class="text-xs text-gray-500 font-medium">{{ activity.time }}</p>
                      </div>
                    </div>
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 glass rounded-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics & System Status -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Analytics Overview -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Analytics Overview</h3>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-500">Live</span>
              </div>
            </div>
            
            <!-- Chart Placeholder -->
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <div class="flex items-center justify-center h-32">
                <div class="text-center">
                  <ChartBarIcon class="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-600">User Growth Chart</p>
                  <p class="text-xs text-gray-500">Interactive charts coming soon</p>
                </div>
              </div>
            </div>
            
            <!-- Key Metrics -->
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <div class="text-2xl font-bold text-gray-900">98.5%</div>
                <div class="text-sm text-gray-600">Uptime</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <div class="text-2xl font-bold text-gray-900">2.3s</div>
                <div class="text-sm text-gray-600">Avg Response</div>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">System Status</h3>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-green-600 font-medium">All Systems Operational</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <!-- Database Status -->
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-green-500 rounded-lg">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Database</div>
                    <div class="text-sm text-gray-600">MySQL 8.0</div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-sm font-medium text-green-700">Connected</span>
                </div>
              </div>

              <!-- API Server Status -->
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-green-500 rounded-lg">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">API Server</div>
                    <div class="text-sm text-gray-600">Laravel 10.x</div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-sm font-medium text-green-700">Running</span>
                </div>
              </div>

              <!-- Cache Status -->
              <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-yellow-500 rounded-lg">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Cache System</div>
                    <div class="text-sm text-gray-600">Redis</div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span class="text-sm font-medium text-yellow-700">Optimizing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Navigation>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Navigation from '../components/layout/Navigation.vue';
import {
  UsersIcon,
  UserGroupIcon,
  KeyIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowUpIcon,
  UserPlusIcon,
  PlusIcon,
  CogIcon,
  ShieldCheckIcon,
  MinusIcon,
  BoltIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const { user, hasPermission } = useAuth();

const stats = ref({
  totalUsers: 0,
  userGrowth: 0,
  totalRoles: 0,
  activeRoles: 0,
  totalPermissions: 0,
  recentActivity: 0
});

const recentActivities = ref([
  {
    id: 1,
    description: 'New user "John Doe" registered',
    time: '2 minutes ago',
    icon: UserPlusIcon,
    iconClass: 'bg-success'
  },
  {
    id: 2,
    description: 'Role "Manager" permissions updated',
    time: '15 minutes ago',
    icon: CogIcon,
    iconClass: 'bg-info'
  },
  {
    id: 3,
    description: 'User "Jane Smith" logged in',
    time: '1 hour ago',
    icon: UsersIcon,
    iconClass: 'bg-primary'
  },
  {
    id: 4,
    description: 'System backup completed',
    time: '2 hours ago',
    icon: ClockIcon,
    iconClass: 'bg-warning'
  }
]);

const navigateTo = (path) => {
  router.push(path);
};

const fetchDashboardStats = async () => {
  try {
    // Simulate API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    stats.value = {
      totalUsers: 1247,
      userGrowth: 12.5,
      totalRoles: 8,
      activeRoles: 6,
      totalPermissions: 24,
      recentActivity: 156
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
};

onMounted(() => {
  fetchDashboardStats();
});
</script>

<style scoped>
@reference "../style.css";

/* Modern Dashboard Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(8px) rotate(-1deg); }
  66% { transform: translateY(-12px) rotate(1deg); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.5s ease-out;
}

/* Glass Effects */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.shadow-glass {
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Gradient Utilities */
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* Hover Effects */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Card Enhancements */
.stats-card {
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.stats-card:hover::before {
  left: 100%;
}

/* Progress Bars */
.progress-bar {
  position: relative;
  overflow: hidden;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.welcome-icon {
  opacity: 0.3;
}

/* Custom hover effects for cards */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Custom animation for buttons */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Icon background colors for activity items */
.bg-primary {
  background-color: #3b82f6;
  color: white;
}

.bg-success {
  background-color: #10b981;
  color: white;
}

.bg-warning {
  background-color: #f59e0b;
  color: white;
}

.bg-info {
  background-color: #06b6d4;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8, #6a4190);
}
</style>