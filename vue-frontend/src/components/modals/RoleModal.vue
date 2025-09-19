<template>
  <div class="modal show d-block" tabindex="-1" :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content shadow-lg border-0" :style="{ borderRadius: '1rem' }">
        <!-- Header -->
        <div class="modal-header bg-gradient-primary border-0 text-white" :style="{ borderRadius: '1rem 1rem 0 0' }">
          <div class="d-flex align-items-center">
            <div class="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center me-3 p-2">
              <UserGroupIcon style="width: 1.5rem; height: 1.5rem;" class="text-white" />
            </div>
            <h5 class="modal-title fw-semibold mb-0">
              {{ role ? 'Edit Role' : 'Create New Role' }}
            </h5>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body p-4">
          <!-- Error Alert -->
          <div v-if="error" class="alert alert-danger d-flex align-items-center mb-4" :style="{ borderRadius: '0.75rem' }">
            <div class="rounded-circle bg-danger me-2" :style="{ width: '0.5rem', height: '0.5rem' }"></div>
            <span class="fw-medium">{{ error }}</span>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Role Name -->
            <div class="mb-4">
              <label for="name" class="form-label fw-semibold text-dark">
                Role Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                class="form-control shadow-sm"
                :style="{ borderRadius: '0.75rem', backgroundColor: 'rgba(248, 249, 250, 0.8)' }"
                v-model="formData.name"
                placeholder="e.g., Administrator, Editor, Viewer"
              />
              <div v-if="errors.name" class="text-danger small mt-2 d-flex align-items-center">
                <div class="rounded-circle bg-danger me-2" :style="{ width: '0.25rem', height: '0.25rem' }"></div>
                {{ errors.name[0] }}
              </div>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label for="description" class="form-label fw-semibold text-dark">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                class="form-control shadow-sm"
                :style="{ borderRadius: '0.75rem', backgroundColor: 'rgba(248, 249, 250, 0.8)', resize: 'none' }"
                v-model="formData.description"
                placeholder="Describe the role's responsibilities and access level..."
              ></textarea>
              <div v-if="errors.description" class="text-danger small mt-2 d-flex align-items-center">
                <div class="rounded-circle bg-danger me-2" :style="{ width: '0.25rem', height: '0.25rem' }"></div>
                {{ errors.description[0] }}
              </div>
            </div>

            <!-- Permissions -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <label class="form-label fw-semibold text-dark mb-0 d-flex align-items-center">
                  <ShieldCheckIcon style="width: 1rem; height: 1rem;" class="text-primary me-2" />
                  <span>Permissions</span>
                </label>
                <button
                  type="button"
                  @click="toggleAllPermissions"
                  class="btn btn-outline-primary btn-sm"
                  :style="{ borderRadius: '0.5rem' }"
                >
                  {{ formData.permission_ids.length === permissions.length ? 'Deselect All' : 'Select All' }}
                </button>
              </div>
              
              <div class="border rounded-3 p-3 bg-light" :style="{ maxHeight: '16rem', overflowY: 'auto' }">
                <div class="row g-3">
                  <div v-for="permission in permissions" :key="permission.id" class="col-md-6">
                    <div class="form-check p-3 rounded-3 hover-bg-white h-100">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :id="`permission-${permission.id}`"
                        :value="permission.id"
                        v-model="formData.permission_ids"
                      />
                      <label class="form-check-label fw-medium text-dark" :for="`permission-${permission.id}`">
                        {{ permission.name }}
                      </label>
                      <div v-if="permission.description" class="text-muted small mt-1">
                        {{ permission.description }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <div v-if="permissions.length === 0" class="text-center py-5">
                  <ShieldCheckIcon style="width: 3rem; height: 3rem;" class="text-muted mx-auto mb-3" />
                  <p class="text-muted fw-medium mb-0">No permissions available</p>
                </div>
              </div>
              
              <div v-if="errors.permission_ids" class="text-danger small mt-2 d-flex align-items-center">
                <div class="rounded-circle bg-danger me-2" :style="{ width: '0.25rem', height: '0.25rem' }"></div>
                {{ errors.permission_ids[0] }}
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-top bg-light" :style="{ borderRadius: '0 0 1rem 1rem' }">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
            :style="{ borderRadius: '0.75rem' }"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary shadow-lg"
            :style="{ borderRadius: '0.75rem', minWidth: '100px' }"
            @click="handleSubmit"
          >
            <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-else>{{ role ? 'Update Role' : 'Create Role' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { rolesAPI } from '../../services/api';
import { UserGroupIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';

// Props
const props = defineProps({
  role: {
    type: Object,
    default: null
  },
  permissions: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// Reactive data
const formData = reactive({
  name: '',
  description: '',
  permission_ids: []
});

const loading = ref(false);
const error = ref('');
const errors = ref({});

// Methods
const handleSubmit = async (e) => {
  e.preventDefault();
  loading.value = true;
  error.value = '';
  errors.value = {};

  try {
    let response;
    const roleData = {
      name: formData.name,
      description: formData.description,
      permissions: formData.permission_ids
    };

    if (props.role) {
      // Update existing role
      response = await rolesAPI.update(props.role.id, roleData);
    } else {
      // Create new role
      response = await rolesAPI.create(roleData);
    }

    emit('save', response.data.data);
  } catch (error) {
    const message = error.response?.data?.message || 'Operation failed';
    const validationErrors = error.response?.data?.errors || {};
    error.value = message;
    errors.value = validationErrors;
  } finally {
    loading.value = false;
  }
};

const toggleAllPermissions = () => {
  if (formData.permission_ids.length === props.permissions.length) {
    // Deselect all
    formData.permission_ids = [];
  } else {
    // Select all
    formData.permission_ids = props.permissions.map(p => p.id);
  }
};

// Watch for role changes
watch(() => props.role, (newRole) => {
  if (newRole) {
    formData.name = newRole.name || '';
    formData.description = newRole.description || '';
    formData.permission_ids = newRole.permissions?.map(permission => permission.id) || [];
  } else {
    formData.name = '';
    formData.description = '';
    formData.permission_ids = [];
  }
}, { immediate: true });

// Reset errors when form data changes
watch(formData, () => {
  error.value = '';
  errors.value = {};
});
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hover-bg-white:hover {
  background-color: white !important;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.form-check-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background-color: #667eea;
  border-color: #667eea;
}

.btn-primary:hover {
  background-color: #5a6fd8;
  border-color: #5a6fd8;
}

.btn-outline-primary {
  color: #667eea;
  border-color: #667eea;
}

.btn-outline-primary:hover {
  background-color: #667eea;
  border-color: #667eea;
}
</style>