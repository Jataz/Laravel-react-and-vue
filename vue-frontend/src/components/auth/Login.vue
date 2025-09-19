<template>
  <div class="min-h-screen flex items-center justify-center gradient-primary relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-float" style="animation-delay: -3s;"></div>
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full animate-float" style="animation-delay: -1.5s;"></div>
    </div>

    <div class="relative z-10 w-full max-w-md mx-4">
      <!-- Main login card -->
      <div class="glass rounded-3xl p-8 shadow-glass backdrop-blur-xl border border-white/20 animate-slide-up">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mx-auto h-20 w-20 gradient-secondary rounded-3xl flex items-center justify-center mb-6 shadow-lg animate-scale-in">
            <LockClosedIcon class="h-10 w-10 text-white" />
          </div>
          <h1 class="text-4xl font-bold text-white mb-3 text-gradient-primary">Welcome Back</h1>
          <p class="text-white/80 text-lg">Sign in to your account to continue</p>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl flex items-center space-x-3 backdrop-blur-sm animate-slide-down">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-300 flex-shrink-0" />
          <p class="text-red-100 text-sm">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-semibold text-white/90">Email Address</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <EnvelopeIcon class="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="block w-full pl-12 pr-4 py-4 glass rounded-2xl placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 border border-white/20"
                placeholder="Enter your email"
              />
              <div v-if="errors.email" class="mt-2 text-sm text-red-300">
                {{ errors.email[0] }}
              </div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-white/90">Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <LockClosedIcon class="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-12 pr-12 py-4 glass rounded-2xl placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 border border-white/20"
                placeholder="Enter your password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:scale-110 transition-transform"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5 text-white/60 hover:text-white/80 transition-colors" />
                <EyeSlashIcon v-else class="w-5 h-5 text-white/60 hover:text-white/80 transition-colors" />
              </button>
              <div v-if="errors.password" class="mt-2 text-sm text-red-300">
                {{ errors.password[0] }}
              </div>
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <a href="#" class="text-sm text-white/70 hover:text-white transition-colors font-medium">
              Forgot your password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-4 px-6 gradient-secondary text-white font-bold rounded-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            :disabled="loading"
          >
            <span v-if="loading" class="inline-flex items-center">
              <div class="spinner mr-3"></div>
              Signing In...
            </span>
            <span v-else class="inline-flex items-center justify-center">
              <LockClosedIcon class="w-5 h-5 mr-2" />
              Sign In
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-8 flex items-center">
          <div class="flex-1 border-t border-white/20"></div>
          <span class="px-4 text-white/60 text-sm font-medium">or</span>
          <div class="flex-1 border-t border-white/20"></div>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-white/70 mb-4">
            Don't have an account?
          </p>
          <router-link 
            to="/register" 
            class="inline-flex items-center justify-center w-full py-3 px-6 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
          >
            Create Account
          </router-link>
        </div>
      </div>

      <!-- Additional decorative elements -->
      <div class="mt-8 text-center">
        <p class="text-white/50 text-sm">
          © 2024 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const formData = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const errors = ref({});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  errors.value = {};

  try {
    const result = await login(formData);
    
    if (result.success) {
      const redirectTo = route.query.redirect || '/dashboard';
      router.push(redirectTo);
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
/* Additional custom animations */
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.4s ease-out 0.2s both;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}
</style>