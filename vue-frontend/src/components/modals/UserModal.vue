<template>
  <div 
    v-if="show" 
    class="modal fade show d-block" 
    tabindex="-1" 
    style="background-color: rgba(0,0,0,0.5);"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            <UserIcon class="me-2" style="width: 24px; height: 24px;" />
            {{ modalTitle }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger d-flex align-items-center mb-4" role="alert">
              <ExclamationTriangleIcon class="me-2 flex-shrink-0" style="width: 20px; height: 20px;" />
              {{ error }}
            </div>

            <div class="row">
              <!-- Basic Information -->
              <div class="col-md-6">
                <h6 class="fw-bold mb-3 text-primary">Basic Information</h6>
                
                <!-- Name -->
                <div class="mb-3">
                  <label for="name" class="form-label fw-medium">Full Name *</label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    :readonly="mode === 'view'"
                    placeholder="Enter full name"
                    required
                  />
                  <div v-if="errors.name" class="invalid-feedback">
                    {{ errors.name[0] }}
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label fw-medium">Email Address *</label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    :readonly="mode === 'view'"
                    placeholder="Enter email address"
                    required
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email[0] }}
                  </div>
                </div>

                <!-- Password (only for create mode) -->
                <div v-if="mode === 'create'" class="mb-3">
                  <label for="password" class="form-label fw-medium">Password *</label>
                  <div class="position-relative">
                    <input
                      id="password"
                      v-model="formData.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control pe-5"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      class="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                      @click="showPassword = !showPassword"
                    >
                      <EyeIcon v-if="!showPassword" class="text-muted" style="width: 20px; height: 20px;" />
                      <EyeSlashIcon v-else class="text-muted" style="width: 20px; height: 20px;" />
                    </button>
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password[0] }}
                    </div>
                  </div>
                </div>

                <!-- Confirm Password (only for create mode) -->
                <div v-if="mode === 'create'" class="mb-3">
                  <label for="password_confirmation" class="form-label fw-medium">Confirm Password *</label>
                  <div class="position-relative">
                    <input
                      id="password_confirmation"
                      v-model="formData.password_confirmation"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control pe-5"
                      :class="{ 'is-invalid': errors.password_confirmation }"
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      class="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <EyeIcon v-if="!showConfirmPassword" class="text-muted" style="width: 20px; height: 20px;" />
                      <EyeSlashIcon v-else class="text-muted" style="width: 20px; height: 20px;" />
                    </button>
                    <div v-if="errors.password_confirmation" class="invalid-feedback">
                      {{ errors.password_confirmation[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Role and Status -->
              <div class="col-md-6">
                <h6 class="fw-bold mb-3 text-primary">Role & Status</h6>
                
                <!-- Role -->
                <div class="mb-3">
                  <label for="role_id" class="form-label fw-medium">Role</label>
                  <select
                    id="role_id"
                    v-model="formData.role_id"
                    class="form-select"
                    :class="{ 'is-invalid': errors.role_id }"
                    :disabled="mode === 'view'"
                  >
                    <option value="">Select a role</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                      {{ role.name }}
                    </option>
                  </select>
                  <div v-if="errors.role_id" class="invalid-feedback">
                    {{ errors.role_id[0] }}
                  </div>
                </div>

                <!-- Status -->
                <div class="mb-3">
                  <label for="status" class="form-label fw-medium">Status</label>
                  <select
                    id="status"
                    v-model="formData.status"
                    class="form-select"
                    :class="{ 'is-invalid': errors.status }"
                    :disabled="mode === 'view'"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div v-if="errors.status" class="invalid-feedback">
                    {{ errors.status[0] }}
                  </div>
                </div>

                <!-- Additional Info for View Mode -->
                <div v-if="mode === 'view' && user">
                  <div class="mb-3">
                    <label class="form-label fw-medium">Created At</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="formatDate(user.created_at)"
                      readonly
                    />
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label fw-medium">Last Login</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="user.last_login ? formatDate(user.last_login) : 'Never'"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Role Permissions Preview (for view mode) -->
            <div v-if="mode === 'view' && selectedRole" class="mt-4">
              <h6 class="fw-bold mb-3 text-primary">Role Permissions</h6>
              <div class="border rounded p-3 bg-light">
                <div v-if="selectedRole.permissions && selectedRole.permissions.length > 0" class="row">
                  <div 
                    v-for="permission in selectedRole.permissions" 
                    :key="permission.id"
                    class="col-md-6 col-lg-4 mb-2"
                  >
                    <div class="d-flex align-items-center">
                      <CheckIcon class="text-success me-2" style="width: 16px; height: 16px;" />
                      <span class="small">{{ permission.name }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-muted text-center py-3">
                  No permissions assigned to this role
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              {{ mode === 'view' ? 'Close' : 'Cancel' }}
            </button>
            <button 
              v-if="mode !== 'view'"
              type="submit" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ mode === 'create' ? 'Create User' : 'Update User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import {
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  roles: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String,
    default: 'create', // 'create', 'edit', 'view'
    validator: (value) => ['create', 'edit', 'view'].includes(value)
  }
});

const emit = defineEmits(['close', 'save']);

const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role_id: '',
  status: 'active'
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const errors = ref({});

const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Create New User';
    case 'edit':
      return 'Edit User';
    case 'view':
      return 'User Details';
    default:
      return 'User';
  }
});

const selectedRole = computed(() => {
  if (!formData.role_id) return null;
  return props.roles.find(role => role.id === parseInt(formData.role_id));
});

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    status: 'active'
  });
  error.value = '';
  errors.value = {};
  showPassword.value = false;
  showConfirmPassword.value = false;
};

const populateForm = () => {
  if (props.user) {
    formData.name = props.user.name || '';
    formData.email = props.user.email || '';
    formData.role_id = props.user.role?.id || '';
    formData.status = props.user.status || 'active';
  }
};

const handleSubmit = async () => {
  if (props.mode === 'view') return;

  loading.value = true;
  error.value = '';
  errors.value = {};

  try {
    const submitData = { ...formData };
    
    // Remove password fields for edit mode
    if (props.mode === 'edit') {
      delete submitData.password;
      delete submitData.password_confirmation;
    }

    emit('save', submitData);
  } catch (err) {
    error.value = 'An error occurred while saving the user.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// Watch for prop changes
watch(() => props.show, (newValue) => {
  if (newValue) {
    if (props.mode === 'create') {
      resetForm();
    } else {
      populateForm();
    }
  }
});

watch(() => props.user, () => {
  if (props.show && props.mode !== 'create') {
    populateForm();
  }
});
</script>

<style scoped>
.modal.show {
  display: block !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
}

.text-primary {
  color: #4facfe !important;
}

.btn-primary {
  background-color: #4facfe;
  border-color: #4facfe;
}

.btn-primary:hover {
  background-color: #3d8bfe;
  border-color: #3d8bfe;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>