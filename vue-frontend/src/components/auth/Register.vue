<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center gradient-bg">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 fade-in" style="border-radius: 1rem;">
            <div class="card-body p-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3" 
                     style="width: 4rem; height: 4rem;">
                  <UserPlusIcon class="text-success" style="width: 2rem; height: 2rem;" />
                </div>
                <h2 class="fw-bold text-dark mb-2">Create Account</h2>
                <p class="text-muted">Join us and start managing your system</p>
              </div>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <ExclamationTriangleIcon class="me-2 flex-shrink-0" style="width: 20px; height: 20px;" />
                {{ error }}
              </div>

              <!-- Register Form -->
              <form @submit.prevent="handleSubmit">
                <!-- Name Field -->
                <div class="mb-3">
                  <label for="name" class="form-label fw-medium text-dark">Full Name</label>
                  <div class="position-relative">
                    <div class="position-absolute top-50 start-0 translate-middle-y ms-3">
                      <UserIcon class="text-muted" style="width: 20px; height: 20px;" />
                    </div>
                    <input
                      id="name"
                      v-model="formData.name"
                      type="text"
                      class="form-control ps-5 py-3"
                      :class="{ 'is-invalid': errors.name }"
                      placeholder="Enter your full name"
                      required
                      style="border-radius: 0.75rem; border: 2px solid #e9ecef;"
                    />
                    <div v-if="errors.name" class="invalid-feedback">
                      {{ errors.name[0] }}
                    </div>
                  </div>
                </div>

                <!-- Email Field -->
                <div class="mb-3">
                  <label for="email" class="form-label fw-medium text-dark">Email Address</label>
                  <div class="position-relative">
                    <div class="position-absolute top-50 start-0 translate-middle-y ms-3">
                      <EnvelopeIcon class="text-muted" style="width: 20px; height: 20px;" />
                    </div>
                    <input
                      id="email"
                      v-model="formData.email"
                      type="email"
                      class="form-control ps-5 py-3"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="Enter your email"
                      required
                      style="border-radius: 0.75rem; border: 2px solid #e9ecef;"
                    />
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email[0] }}
                    </div>
                  </div>
                </div>

                <!-- Password Field -->
                <div class="mb-3">
                  <label for="password" class="form-label fw-medium text-dark">Password</label>
                  <div class="position-relative">
                    <div class="position-absolute top-50 start-0 translate-middle-y ms-3">
                      <LockClosedIcon class="text-muted" style="width: 20px; height: 20px;" />
                    </div>
                    <input
                      id="password"
                      v-model="formData.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control ps-5 pe-5 py-3"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Enter your password"
                      required
                      style="border-radius: 0.75rem; border: 2px solid #e9ecef;"
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

                <!-- Confirm Password Field -->
                <div class="mb-4">
                  <label for="password_confirmation" class="form-label fw-medium text-dark">Confirm Password</label>
                  <div class="position-relative">
                    <div class="position-absolute top-50 start-0 translate-middle-y ms-3">
                      <LockClosedIcon class="text-muted" style="width: 20px; height: 20px;" />
                    </div>
                    <input
                      id="password_confirmation"
                      v-model="formData.password_confirmation"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control ps-5 pe-5 py-3"
                      :class="{ 'is-invalid': errors.password_confirmation }"
                      placeholder="Confirm your password"
                      required
                      style="border-radius: 0.75rem; border: 2px solid #e9ecef;"
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

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="btn btn-success w-100 py-3 fw-semibold"
                  :disabled="loading"
                  style="border-radius: 0.75rem; background: var(--success-gradient); border: none;"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </form>

              <!-- Login Link -->
              <div class="text-center mt-4">
                <p class="text-muted mb-0">
                  Already have an account? 
                  <router-link to="/login" class="text-decoration-none fw-medium">
                    Sign in here
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  UserIcon,
  UserPlusIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline';

const router = useRouter();
const { register } = useAuth();

const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const errors = ref({});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  errors.value = {};

  try {
    const result = await register(formData);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      error.value = result.error;
      if (result.errors) {
        errors.value = result.errors;
      }
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-control:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
}

.card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}
</style>