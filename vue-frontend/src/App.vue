<script setup>
import { onMounted } from 'vue';
import { useAuth } from './composables/useAuth';

const { initAuth } = useAuth();

onMounted(() => {
  initAuth();
});
</script>

<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<style>
/* Additional global styles for enhanced animations */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced skeleton loading styles */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  @apply h-4 rounded mb-2;
}

.skeleton-avatar {
  @apply w-12 h-12 rounded-full;
}

.skeleton-button {
  @apply h-10 rounded-lg w-24;
}

/* Modern hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
