<template>
  <div class="min-vh-100 bg-gradient-primary">
    <Navigation @toggle="setSidebarCollapsed" />
    
    <div :class="`container-fluid py-4 main-content ${sidebarCollapsed ? 'collapsed' : ''}`">
      <div class="px-3 py-4">
        <!-- Header -->
        <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
          <div class="flex-grow-1">
            <h1 class="display-5 fw-bold text-gradient mb-2">Roles</h1>
            <p class="text-muted small">
              Manage user roles and their associated permissions.
            </p>
          </div>
          <div class="mt-3 mt-sm-0">
            <button
              type="button"
              @click="handleCreateRole"
              class="btn btn-primary shadow-lg rounded-pill px-4 py-2"
            >
              <PlusIcon style="width: 1rem; height: 1rem;" class="me-2" />
              Create Role
            </button>
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="position-relative">
              <MagnifyingGlassIcon 
                style="width: 1rem; height: 1rem;" 
                class="position-absolute text-muted"
                :style="{ top: '50%', left: '1rem', transform: 'translateY(-50%)' }"
              />
              <input
                type="text"
                v-model="searchTerm"
                class="form-control shadow-sm"
                :style="{ borderRadius: '2rem', paddingLeft: '3rem', backgroundColor: 'rgba(255, 255, 255, 0.9)' }"
                placeholder="Search roles..."
              />
            </div>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger d-flex align-items-center mb-4" :style="{ borderRadius: '0.75rem' }">
          <div class="rounded-circle bg-danger me-2" :style="{ width: '0.5rem', height: '0.5rem' }"></div>
          <span class="fw-medium">{{ error }}</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="d-flex align-items-center justify-content-center" :style="{ height: '16rem' }">
          <div class="spinner-border text-primary" :style="{ width: '8rem', height: '8rem' }" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Roles Grid -->
        <div v-else class="row g-4">
          <div v-for="role in filteredRoles" :key="role.id" class="col-lg-4 col-md-6">
            <div class="card h-100 shadow-sm border-0" :style="{ borderRadius: '1rem' }">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="d-flex align-items-center">
                    <div 
                      class="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      :style="{ width: '3rem', height: '3rem' }"
                    >
                      <ShieldCheckIcon style="width: 1.5rem; height: 1.5rem;" class="text-primary" />
                    </div>
                    <div>
                      <h5 class="card-title fw-bold mb-1 text-dark">{{ role.name }}</h5>
                      <span class="badge bg-primary-subtle text-primary" :style="{ borderRadius: '1rem' }">
                        {{ role.permissions?.length || 0 }} permissions
                      </span>
                    </div>
                  </div>
                  
                  <div class="d-flex gap-2">
                    <button
                      @click="handleEditRole(role)"
                      class="btn btn-outline-primary btn-sm rounded-pill"
                      title="Edit role"
                    >
                      <PencilIcon style="width: 1rem; height: 1rem;" />
                    </button>
                    <button
                      @click="handleDeleteRole(role.id)"
                      class="btn btn-outline-danger btn-sm rounded-pill"
                      title="Delete role"
                    >
                      <TrashIcon style="width: 1rem; height: 1rem;" />
                    </button>
                  </div>
                </div>
                
                <p class="card-text text-muted small mb-3">
                  {{ role.description || 'No description provided' }}
                </p>
                
                <div>
                  <div class="mb-3">
                    <span class="text-uppercase fw-medium text-muted" :style="{ fontSize: '0.75rem', letterSpacing: '0.05em' }">
                      Permissions
                    </span>
                    <div class="mt-2 d-flex flex-wrap gap-1">
                      <template v-if="role.permissions && role.permissions.length > 0">
                        <span
                          v-for="permission in role.permissions.slice(0, 3)"
                          :key="permission.id"
                          class="badge bg-success-subtle text-success border border-success-subtle"
                          :style="{ borderRadius: '1rem' }"
                        >
                          {{ permission.name }}
                        </span>
                        <span 
                          v-if="role.permissions.length > 3"
                          class="badge bg-secondary-subtle text-secondary border border-secondary-subtle" 
                          :style="{ borderRadius: '1rem' }"
                        >
                          +{{ role.permissions.length - 3 }} more
                        </span>
                      </template>
                      <span v-else class="text-muted" :style="{ fontSize: '0.75rem' }">
                        No permissions assigned
                      </span>
                    </div>
                  </div>
                  
                  <div class="pt-3 border-top">
                    <span class="text-muted" :style="{ fontSize: '0.75rem' }">
                      Created {{ formatDate(role.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredRoles.length === 0" class="text-center py-5">
          <div 
            class="mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center mb-3" 
            :style="{ width: '4rem', height: '4rem' }"
          >
            <ShieldCheckIcon style="width: 2rem; height: 2rem;" class="text-muted" />
          </div>
          <h5 class="fw-medium text-dark mb-2">No roles found</h5>
          <p class="text-muted small">
            {{ searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first role.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Role Modal -->
    <RoleModal
      v-if="isModalOpen"
      :role="selectedRole"
      :permissions="permissions"
      @close="closeModal"
      @save="handleRoleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { rolesAPI, permissionsAPI } from '../services/api';
import Navigation from '../components/layout/Navigation.vue';
import RoleModal from '../components/modals/RoleModal.vue';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline';

// Reactive data
const roles = ref([]);
const permissions = ref([]);
const loading = ref(true);
const searchTerm = ref('');
const isModalOpen = ref(false);
const selectedRole = ref(null);
const error = ref('');
const sidebarCollapsed = ref(false);

// Computed properties
const filteredRoles = computed(() => {
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.value.toLowerCase()))
  );
});

// Methods
const fetchRoles = async () => {
  try {
    const response = await rolesAPI.getAll();
    roles.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    error.value = 'Failed to fetch roles';
  }
};

const fetchPermissions = async () => {
  try {
    const response = await permissionsAPI.getAll();
    permissions.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }
};

const handleCreateRole = () => {
  selectedRole.value = null;
  isModalOpen.value = true;
};

const handleEditRole = (role) => {
  selectedRole.value = role;
  isModalOpen.value = true;
};

const handleDeleteRole = async (roleId) => {
  if (window.confirm('Are you sure you want to delete this role?')) {
    try {
      await rolesAPI.delete(roleId);
      roles.value = roles.value.filter(role => role.id !== roleId);
    } catch (error) {
      error.value = 'Failed to delete role';
      console.error('Error deleting role:', error);
    }
  }
};

const handleRoleSaved = (savedRole) => {
  if (selectedRole.value) {
    // Update existing role
    const index = roles.value.findIndex(role => role.id === savedRole.id);
    if (index !== -1) {
      roles.value[index] = savedRole;
    }
  } else {
    // Add new role
    roles.value.push(savedRole);
  }
  closeModal();
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedRole.value = null;
};

const setSidebarCollapsed = (collapsed) => {
  sidebarCollapsed.value = collapsed;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchRoles(), fetchPermissions()]);
  loading.value = false;
});
</script>

<style scoped>
@reference "../style.css";

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 80px;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.hover-bg-white:hover {
  background-color: white !important;
}

@media (max-width: 768px) {
  .main-content,
  .main-content.collapsed {
    margin-left: 0;
  }
}
</style>