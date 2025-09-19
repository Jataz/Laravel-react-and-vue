<template>
  <div class="modal show d-block" tabindex="-1" :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-lg border-0" :style="{ borderRadius: '1rem' }">
        <!-- Header -->
        <div class="modal-header bg-gradient-primary border-0 text-white" :style="{ borderRadius: '1rem 1rem 0 0' }">
          <div class="d-flex align-items-center">
            <div class="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center me-3 p-2">
              <ShieldCheckIcon style="width: 1.5rem; height: 1.5rem;" class="text-white" />
            </div>
            <h5 class="modal-title fw-semibold mb-0">
              {{ permission ? 'Edit Permission' : 'Create New Permission' }}
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
            <!-- Permission Name -->
            <div class="mb-4">
              <label for="name" class="form-label fw-semibold text-dark d-flex align-items-center">
                <KeyIcon style="width: 1rem; height: 1rem;" class="text-success me-2" />
                Permission Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                class="form-control shadow-sm"
                :style="{ borderRadius: '0.75rem', backgroundColor: 'rgba(248, 249, 250, 0.8)' }"
                v-model="formData.name"
                placeholder="e.g., view users, create posts, manage settings"
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
                rows="4"
                class="form-control shadow-sm"
                :style="{ borderRadius: '0.75rem', backgroundColor: 'rgba(248, 249, 250, 0.8)', resize: 'none' }"
                v-model="formData.description"
                placeholder="Describe what this permission allows users to do..."
              ></textarea>
              <div v-if="errors.description" class="text-danger small mt-2 d-flex align-items-center">
                <div class="rounded-circle bg-danger me-2" :style="{ width: '0.25rem', height: '0.25rem' }"></div>
                {{ errors.description[0] }}
              </div>
            </div>

            <!-- Permission Guidelines -->
            <div class="bg-light border rounded-3 p-3 mb-4">
              <h6 class="fw-semibold text-dark mb-2 d-flex align-items-center">
                <ShieldCheckIcon style="width: 1rem; height: 1rem;" class="text-primary me-2" />
                Permission Guidelines
              </h6>
              <ul class="text-muted small mb-0 ps-3">
                <li>Use clear, descriptive names (e.g., "view users", "edit posts")</li>
                <li>Follow a consistent naming pattern: action + resource</li>
                <li>Avoid overly broad permissions that grant too much access</li>
                <li>Consider the principle of least privilege</li>
              </ul>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-top bg-light" :style="{ borderRadius: '0 0 1rem 1rem' }">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            @click="handleSubmit"
            class="btn btn-primary shadow-lg"
          >
            <div v-if="loading" class="spinner-border spinner-border-sm me-2" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="loading">Loading...</span>
            <span v-else>{{ permission ? 'Update Permission' : 'Create Permission' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { permissionsAPI } from '../../services/api';
import { ShieldCheckIcon, KeyIcon } from '@heroicons/vue/24/outline';

// Props
const props = defineProps({
  permission: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// Reactive data
const formData = reactive({
  name: '',
  description: ''
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
    const permissionData = {
      name: formData.name,
      description: formData.description
    };

    if (props.permission) {
      // Update existing permission
      response = await permissionsAPI.update(props.permission.id, permissionData);
    } else {
      // Create new permission
      response = await permissionsAPI.create(permissionData);
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

// Watch for permission changes
watch(() => props.permission, (newPermission) => {
  if (newPermission) {
    formData.name = newPermission.name || '';
    formData.description = newPermission.description || '';
  } else {
    formData.name = '';
    formData.description = '';
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

.btn-primary {
  background-color: #667eea;
  border-color: #667eea;
}

.btn-primary:hover {
  background-color: #5a6fd8;
  border-color: #5a6fd8;
}

.btn-primary:disabled {
  background-color: #667eea;
  border-color: #667eea;
  opacity: 0.6;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
}
</style>