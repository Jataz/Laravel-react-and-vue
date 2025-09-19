<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Modern Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200">
      <!-- Logo/Brand -->
      <div class="flex items-center px-6 py-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">G</span>
          </div>
          <span class="text-lg font-semibold text-gray-900">Gridlines UI</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-6 px-3">
        <!-- Profile Section -->
        <div class="mb-6">
          <p class="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Profile</p>
          <div class="space-y-1">
            <a href="#" class="bg-blue-50 text-blue-700 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <UserIcon class="text-blue-500 mr-3 h-5 w-5" />
              Edit Profile
            </a>
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <GlobeAltIcon class="text-gray-400 mr-3 h-5 w-5" />
              Language
            </a>
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <BellIcon class="text-gray-400 mr-3 h-5 w-5" />
              Notifications
            </a>
          </div>
        </div>

        <!-- Bank Section -->
        <div class="mb-6">
          <p class="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Bank</p>
          <div class="space-y-1">
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <CreditCardIcon class="text-gray-400 mr-3 h-5 w-5" />
              Payments
            </a>
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <DocumentTextIcon class="text-gray-400 mr-3 h-5 w-5" />
              Taxes
            </a>
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <ArrowsRightLeftIcon class="text-gray-400 mr-3 h-5 w-5" />
              Transactions
            </a>
          </div>
        </div>

        <!-- Secure Section -->
        <div class="mb-6">
          <p class="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Secure</p>
          <div class="space-y-1">
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <LockClosedIcon class="text-gray-400 mr-3 h-5 w-5" />
              Password
            </a>
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <KeyIcon class="text-gray-400 mr-3 h-5 w-5" />
              Access
            </a>
            <a href="#" class="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <ClockIcon class="text-gray-400 mr-3 h-5 w-5" />
              Sessions
            </a>
          </div>
        </div>

        <!-- Delete Account -->
        <div class="mt-8">
          <a href="#" class="text-red-600 hover:bg-red-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
            <TrashIcon class="text-red-500 mr-3 h-5 w-5" />
            Delete account
          </a>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search"
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">⌘F</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="relative p-2 text-gray-400 hover:text-gray-500">
              <BellIcon class="h-6 w-6" />
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>
            <div class="relative">
              <button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                <span class="text-sm font-medium text-gray-700">Super Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Profile Section -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h1 class="text-xl font-semibold text-gray-900">Edit Profile</h1>
                </div>
                
                <div class="p-6">
                  <!-- Profile Photo Section -->
                  <div class="flex items-start space-x-6 mb-8">
                    <div class="relative">
                      <img class="h-20 w-20 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-gray-900 mb-1">Upload new photo</h3>
                      <p class="text-sm text-gray-500 mb-3">At least 800×800 px recommended.<br />JPG or PNG is allowed</p>
                      <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Choose File
                      </button>
                    </div>
                  </div>

                  <!-- Personal Info Section -->
                  <div class="mb-8">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-lg font-medium text-gray-900">Personal Info</h3>
                      <button class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                        <PencilIcon class="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <p class="text-sm text-gray-900">Ronald Richards</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p class="text-sm text-gray-900">RonaldRich@example.com</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p class="text-sm text-gray-900">(219) 555-0114</p>
                      </div>
                    </div>
                  </div>

                  <!-- Location Section -->
                  <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Location</h3>
                    <div class="flex items-center space-x-3">
                      <div class="relative flex-1">
                        <MapPinIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value="California"
                          class="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button class="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save changes
                      </button>
                    </div>
                  </div>

                  <!-- Bio Section -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-lg font-medium text-gray-900">Bio</h3>
                      <button class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                        <PencilIcon class="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p class="text-sm text-gray-700 leading-relaxed">
                        Hi 👋, I'm Ronald, a passionate UX designer with 10 of experience in creating intuitive and user-centered digital experiences. With a strong background in user research, information architecture, and interaction design, I am dedicated to crafting seamless and delightful user journeys.
                      </p>
                      <p class="text-sm text-gray-700 leading-relaxed mt-3">
                        I have a keen eye for detail and a deep understanding of user needs, which allows me to create visually appealing and functional designs. I am proficient in using industry-
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar - Complete Profile -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-6">Complete your profile</h3>
                
                <!-- Progress Circle -->
                <div class="flex justify-center mb-6">
                  <div class="relative w-24 h-24">
                    <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="transparent"
                        class="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="transparent"
                        stroke-dasharray="251.2"
                        stroke-dashoffset="150.72"
                        class="text-green-500"
                        stroke-linecap="round"
                      />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-2xl font-bold text-gray-900">40%</span>
                    </div>
                  </div>
                </div>

                <!-- Progress Items -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <CheckCircleIcon class="h-5 w-5 text-green-500" />
                      <span class="text-sm text-gray-700">Setup account</span>
                    </div>
                    <span class="text-sm text-gray-500">10%</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <CheckCircleIcon class="h-5 w-5 text-green-500" />
                      <span class="text-sm text-gray-700">Upload your photo</span>
                    </div>
                    <span class="text-sm text-gray-500">5%</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <CheckCircleIcon class="h-5 w-5 text-green-500" />
                      <span class="text-sm text-gray-700">Personal Info</span>
                    </div>
                    <span class="text-sm text-gray-500">10%</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <XCircleIcon class="h-5 w-5 text-red-500" />
                      <span class="text-sm text-gray-700">Location</span>
                    </div>
                    <span class="text-sm text-green-600 font-medium">+20%</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <CheckCircleIcon class="h-5 w-5 text-green-500" />
                      <span class="text-sm text-gray-700">Biography</span>
                    </div>
                    <span class="text-sm text-gray-500">15%</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <XCircleIcon class="h-5 w-5 text-red-500" />
                      <span class="text-sm text-gray-700">Notifications</span>
                    </div>
                    <span class="text-sm text-green-600 font-medium">+10%</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <XCircleIcon class="h-5 w-5 text-red-500" />
                      <span class="text-sm text-gray-700">Bank details</span>
                    </div>
                    <span class="text-sm text-green-600 font-medium">+30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  UserIcon,
  GlobeAltIcon,
  BellIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon,
  LockClosedIcon,
  KeyIcon,
  ClockIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
</script>

<style scoped>
/* Custom styles for the modern design */
.bg-gray-50 {
  background-color: #f9fafb;
}
</style>