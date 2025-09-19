<template>
  <div class="min-vh-100 bg-gradient-primary">
    <Navigation @toggle="setSidebarCollapsed" />
    
    <!-- Access Denied -->
    <div v-if="!hasPermission('view permissions')" class="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div class="text-center">
        <ShieldCheckIcon style="width: 3rem; height: 3rem;" class="text-muted mx-auto mb-3" />
        <h3 class="fw-medium text-dark mb-2">Access Denied</h3>
        <p class="text-muted small">
          You don't have permission to manage permissions.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" :class="`d-flex align-items-center justify-content-center main-content ${sidebarCollapsed ? 'collapsed' : ''}`" :style="{ height: '16rem' }">
      <div class="spinner-border text-primary" :style="{ width: '4rem', height: '4rem' }" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else :class="`container-fluid py-4 main-content ${sidebarCollapsed ? 'collapsed' : ''}`">
      <div class="row">
        <div class="col-12">
          <!-- Header -->
          <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
            <div class="flex-grow-1">
              <h1 class="display-5 fw-bold text-gradient mb-2">Permissions</h1>
              <p class="text-muted small">
                Manage system permissions and access controls.
              </p>
            </div>
            <div class="mt-3 mt-sm-0">
              <button
                type="button"
                @click="handleCreatePermission"
                class="btn btn-primary btn-lg d-inline-flex align-items-center shadow-lg"
              >
                <PlusIcon style="width: 1.25rem; height: 1.25rem;" class="me-2" />
                Add Permission
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="alert alert-danger shadow-sm" :style="{ borderRadius: '0.75rem' }">
            {{ error }}
          </div>

          <!-- Search -->
          <div class="mb-4">
            <div class="position-relative">
              <div class="position-absolute top-50 start-0 translate-middle-y ps-3">
                <MagnifyingGlassIcon style="width: 1.25rem; height: 1.25rem;" class="text-muted" />
              </div>
              <input
                type="text"
                class="form-control form-control-lg ps-5 shadow-sm"
                :style="{ borderRadius: '0.75rem' }"
                placeholder="Search permissions..."
                v-model="searchTerm"
              />
            </div>
          </div>

          <!-- Permissions Table -->
          <div class="card shadow-lg border-0 bg-white bg-opacity-90" :style="{ borderRadius: '1rem' }">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="bg-light">
                  <tr>
                    <th class="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                      Permission
                    </th>
                    <th class="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                      Description
                    </th>
                    <th class="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                      Created
                    </th>
                    <th class="px-4 py-3 border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="permission in filteredPermissions" :key="permission.id" class="border-0">
                    <td class="px-4 py-4 border-0">
                      <div class="d-flex align-items-center">
                        <div 
                          class="rounded-circle bg-gradient-success d-flex align-items-center justify-content-center shadow-sm me-3" 
                          :style="{ width: '2.5rem', height: '2.5rem' }"
                        >
                          <KeyIcon style="width: 1.25rem; height: 1.25rem;" class="text-white" />
                        </div>
                        <div class="fw-semibold text-dark">{{ permission.name }}</div>
                      </div>
                    </td>
                    <td class="px-4 py-4 border-0">
                      <div class="text-muted small" :style="{ maxWidth: '20rem' }">
                        {{ permission.description || 'No description provided' }}
                      </div>
                    </td>
                    <td class="px-4 py-4 border-0 text-muted small">
                      {{ formatDate(permission.created_at) }}
                    </td>
                    <td class="px-4 py-4 border-0">
                      <div class="d-flex justify-content-end gap-2">
                        <button
                          @click="handleEditPermission(permission)"
                          class="btn btn-sm btn-outline-primary border-0 hover-scale"
                          title="Edit permission"
                        >
                          <PencilIcon style="width: 1rem; height: 1rem;" />
                        </button>
                        <button
                          @click="handleDeletePermission(permission.id)"
                          class="btn btn-sm btn-outline-danger border-0 hover-scale"
                          title="Delete permission"
                        >
                          <TrashIcon style="width: 1rem; height: 1rem;" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPermissions.length === 0" class="text-center py-5 fade-in">
            <div 
              class="mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center mb-3" 
              :style="{ width: '4rem', height: '4rem' }"
            >
              <KeyIcon style="width: 2rem; height: 2rem;" class="text-muted" />
            </div>
            <h5 class="fw-medium text-dark mb-2">No permissions found</h5>
            <p class="text-muted small">
              {{ searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first permission.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Permission Modal -->
    <PermissionModal
      v-if="isModalOpen"
      :permission="selectedPermission"
      @close="closeModal"
      @save="handlePermissionSaved"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="modal show d-block" tabindex="-1" :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg border-0" :style="{ borderRadius: '1rem' }">
          <div class="modal-body text-center p-4">
            <div 
              class="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 mb-4" 
              :style="{ width: '3rem', height: '3rem' }"
            >
              <ExclamationTriangleIcon style="width: 1.5rem; height: 1.5rem;" class="text-danger" />
            </div>
            <h5 class="fw-semibold text-dark mb-2">Delete Permission</h5>
            <p class="text-muted small mb-4">
              Are you sure you want to delete this permission? This action cannot be undone.
            </p>
            <div class="d-flex justify-content-center gap-3">
              <button
                @click="isDeleteModalOpen = false"
                class="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { permissionsAPI } from '../services/api';
import { useAuth } from '../composables/useAuth';
import Navigation from '../components/layout/Navigation.vue';
import PermissionModal from '../components/modals/PermissionModal.vue';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  KeyIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

// Composables
const { hasPermission } = useAuth();

// Reactive data
const permissions = ref([]);
const loading = ref(true);
const error = ref('');
const searchTerm = ref('');
const isModalOpen = ref(false);
const selectedPermission = ref(null);
const isDeleteModalOpen = ref(false);
const permissionToDelete = ref(null);
const sidebarCollapsed = ref(false);

// Computed properties
const filteredPermissions = computed(() => {
  return permissions.value.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchTerm.value.toLowerCase()))
  );
});

// Methods
const fetchPermissions = async () => {
  try {
    loading.value = true;
    const response = await permissionsAPI.getAll();
    permissions.value = response.data.data;
  } catch (error) {
    error.value = 'Failed to fetch permissions';
    console.error('Error fetching permissions:', error);
  } finally {
    loading.value = false;
  }
};

const handleCreatePermission = () => {
  selectedPermission.value = null;
  isModalOpen.value = true;
};

const handleEditPermission = (permission) => {
  selectedPermission.value = permission;
  isModalOpen.value = true;
};

const handleDeletePermission = (permissionId) => {
  permissionToDelete.value = permissionId;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  try {
    await permissionsAPI.delete(permissionToDelete.value);
    permissions.value = permissions.value.filter(p => p.id !== permissionToDelete.value);
    isDeleteModalOpen.value = false;
    permissionToDelete.value = null;
  } catch (error) {
    error.value = 'Failed to delete permission';
    console.error('Error deleting permission:', error);
  }
};

const handlePermissionSaved = (savedPermission) => {
  if (selectedPermission.value) {
    // Update existing permission
    const index = permissions.value.findIndex(p => p.id === savedPermission.id);
    if (index !== -1) {
      permissions.value[index] = savedPermission;
    }
  } else {
    // Add new permission
    permissions.value.push(savedPermission);
  }
  closeModal();
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPermission.value = null;
};

const setSidebarCollapsed = (collapsed) => {
  sidebarCollapsed.value = collapsed;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  fetchPermissions();
});
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.bg-gradient-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
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

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.1);
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .main-content,
  .main-content.collapsed {
    margin-left: 0;
  }
}
</style>