<template>
  <Navigation>
    <div class="user-management">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 mb-1 fw-bold">User Management</h2>
          <p class="text-muted mb-0">Manage system users and their permissions</p>
        </div>
        <button 
          v-if="hasPermission('users.create')"
          class="btn btn-primary d-flex align-items-center"
          @click="openCreateModal"
        >
          <PlusIcon class="me-2" style="width: 20px; height: 20px;" />
          Add User
        </button>
      </div>

      <!-- Filters and Search -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="position-relative">
                <MagnifyingGlassIcon 
                  class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
                  style="width: 20px; height: 20px;" 
                />
                <input
                  v-model="searchTerm"
                  type="text"
                  class="form-control ps-5"
                  placeholder="Search users..."
                  @input="handleSearch"
                />
              </div>
            </div>
            <div class="col-md-3">
              <select v-model="selectedRole" class="form-select" @change="handleRoleFilter">
                <option value="">All Roles</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="selectedStatus" class="form-select" @change="handleStatusFilter">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                <ArrowPathIcon class="me-2" style="width: 16px; height: 16px;" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold">Users ({{ filteredUsers.length }})</h6>
            <div class="d-flex align-items-center">
              <span class="text-muted me-3">{{ paginationInfo }}</span>
              <div class="btn-group" role="group">
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  :disabled="currentPage === 1"
                  @click="previousPage"
                >
                  <ChevronLeftIcon style="width: 16px; height: 16px;" />
                </button>
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  :disabled="currentPage === totalPages"
                  @click="nextPage"
                >
                  <ChevronRightIcon style="width: 16px; height: 16px;" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th class="border-0 fw-semibold">User</th>
                  <th class="border-0 fw-semibold">Role</th>
                  <th class="border-0 fw-semibold">Status</th>
                  <th class="border-0 fw-semibold">Last Login</th>
                  <th class="border-0 fw-semibold">Created</th>
                  <th class="border-0 fw-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="paginatedUsers.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    No users found
                  </td>
                </tr>
                <tr v-else v-for="user in paginatedUsers" :key="user.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="user-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                           style="width: 40px; height: 40px;">
                        <UserIcon class="text-white" style="width: 20px; height: 20px;" />
                      </div>
                      <div>
                        <div class="fw-medium">{{ user.name }}</div>
                        <small class="text-muted">{{ user.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-secondary">{{ user.role?.name || 'No Role' }}</span>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      :class="user.status === 'active' ? 'bg-success' : 'bg-danger'"
                    >
                      {{ user.status }}
                    </span>
                  </td>
                  <td>
                    <span v-if="user.last_login" class="text-muted">
                      {{ formatDate(user.last_login) }}
                    </span>
                    <span v-else class="text-muted">Never</span>
                  </td>
                  <td>
                    <span class="text-muted">{{ formatDate(user.created_at) }}</span>
                  </td>
                  <td>
                    <div class="d-flex justify-content-center">
                      <div class="btn-group" role="group">
                        <button 
                          v-if="hasPermission('users.view')"
                          class="btn btn-sm btn-outline-info"
                          @click="viewUser(user)"
                          title="View User"
                        >
                          <EyeIcon style="width: 16px; height: 16px;" />
                        </button>
                        <button 
                          v-if="hasPermission('users.update')"
                          class="btn btn-sm btn-outline-primary"
                          @click="editUser(user)"
                          title="Edit User"
                        >
                          <PencilIcon style="width: 16px; height: 16px;" />
                        </button>
                        <button 
                          v-if="hasPermission('users.delete') && user.id !== currentUser?.id"
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteUser(user)"
                          title="Delete User"
                        >
                          <TrashIcon style="width: 16px; height: 16px;" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- User Modal -->
      <UserModal
        v-if="showModal"
        :show="showModal"
        :user="selectedUser"
        :roles="roles"
        :mode="modalMode"
        @close="closeModal"
        @save="handleSave"
      />

      <!-- Delete Confirmation Modal -->
      <div 
        v-if="showDeleteModal" 
        class="modal fade show d-block" 
        tabindex="-1" 
        style="background-color: rgba(0,0,0,0.5);"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete user <strong>{{ userToDelete?.name }}</strong>?</p>
              <p class="text-muted">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button type="button" class="btn btn-danger" @click="confirmDelete">
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Navigation>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { usersAPI, rolesAPI } from '../services/api';
import Navigation from '../components/layout/Navigation.vue';
import UserModal from '../components/modals/UserModal.vue';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';

const { user: currentUser, hasPermission } = useAuth();

// State
const users = ref([]);
const roles = ref([]);
const loading = ref(false);
const searchTerm = ref('');
const selectedRole = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Modal state
const showModal = ref(false);
const selectedUser = ref(null);
const modalMode = ref('create'); // 'create', 'edit', 'view'
const showDeleteModal = ref(false);
const userToDelete = ref(null);

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role?.id === parseInt(selectedRole.value));
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status === selectedStatus.value);
  }

  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length);
  return `${start}-${end} of ${filteredUsers.value.length}`;
});

// Methods
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await usersAPI.getAll();
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const response = await rolesAPI.getAll();
    roles.value = response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const handleSearch = () => {
  currentPage.value = 1;
};

const handleRoleFilter = () => {
  currentPage.value = 1;
};

const handleStatusFilter = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  searchTerm.value = '';
  selectedRole.value = '';
  selectedStatus.value = '';
  currentPage.value = 1;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const openCreateModal = () => {
  selectedUser.value = null;
  modalMode.value = 'create';
  showModal.value = true;
};

const viewUser = (user) => {
  selectedUser.value = user;
  modalMode.value = 'view';
  showModal.value = true;
};

const editUser = (user) => {
  selectedUser.value = user;
  modalMode.value = 'edit';
  showModal.value = true;
};

const deleteUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await usersAPI.delete(userToDelete.value.id);
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
};

const handleSave = async (userData) => {
  try {
    if (modalMode.value === 'create') {
      const response = await usersAPI.create(userData);
      users.value.push(response.data);
    } else if (modalMode.value === 'edit') {
      const response = await usersAPI.update(selectedUser.value.id, userData);
      const index = users.value.findIndex(u => u.id === selectedUser.value.id);
      if (index !== -1) {
        users.value[index] = response.data;
      }
    }
    closeModal();
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>

<style scoped>
@reference "../style.css";

.table th {
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.user-avatar {
  font-size: 0.875rem;
}

.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.modal.show {
  display: block !important;
}
</style>