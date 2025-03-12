<script setup>
import Logo from "~/components/global/Logo.vue";
import LoginPopup from '~/components/LoginPopup.vue';
import { ref, onMounted, onUnmounted } from "vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import axios from 'axios';

const mobileMenuOpen = ref(false);
const loginPopupOpen = ref(false);
const isAuthenticated = ref(false);
const userRole = ref(null);
const hasScrolled = ref(false);

const checkAuth = async () => {
  if (process.client) {
    const userId = localStorage.getItem('userId');
    console.log('Checking auth, userId:', userId);
    
    if (userId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}`);
        console.log('User data loaded:', response.data);
        isAuthenticated.value = true;
        userRole.value = response.data.user.role_id;
        console.log('Auth state updated:', {
          isAuthenticated: isAuthenticated.value,
          userRole: userRole.value
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('userId');
        isAuthenticated.value = false;
        userRole.value = null;
      }
    }
  }
};

const handleScroll = () => {
  hasScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  checkAuth();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function toggleLoginPopup() {
  loginPopupOpen.value = !loginPopupOpen.value;
}

function closeLoginPopup() {
  loginPopupOpen.value = false;
}

function handleUserLoggedIn(userData) {
  localStorage.setItem('userId', userData.id);
  isAuthenticated.value = true;
  userRole.value = userData.role_id;
  closeLoginPopup();
}

function handleLogout() {
  localStorage.removeItem('userId');
  isAuthenticated.value = false;
  userRole.value = null;
  window.location.reload();
}
</script>

<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    hasScrolled ? 'bg-[#6C63FF] border-b-2 border-white' : 'bg-white'
  ]">
    <div class="max-w-7xl mx-auto p-5 sm:px-16 sm:py-6 flex items-center justify-between font-poppins">
      <Logo :hasScrolled="hasScrolled" />
      <nav class="hidden lg:block">
        <div class="flex items-center space-x-8">
          <ul class="flex items-center space-x-6">
            <li><NuxtLink to="/visitor/about" :class="['font-medium transition-colors duration-300', hasScrolled ? 'text-white hover:text-gray-200' : 'text-[#000000] hover:text-gray-700']">About</NuxtLink></li>
            <li><NuxtLink to="/visitor/contact" :class="['font-medium transition-colors duration-300', hasScrolled ? 'text-white hover:text-gray-200' : 'text-[#000000] hover:text-gray-700']">Contact</NuxtLink></li>
          </ul>
          <ul class="flex items-center space-x-6">
            <li v-if="isAuthenticated && userRole === 1">
              <NuxtLink to="/" :class="['font-medium transition-colors duration-300', hasScrolled ? 'text-white hover:text-gray-200' : 'text-[#000000] hover:text-gray-700']">Dashboard</NuxtLink>
            </li>
            <li v-if="isAuthenticated">
              <NuxtLink to="/settings" :class="['font-medium transition-colors duration-300', hasScrolled ? 'text-white hover:text-gray-200' : 'text-[#000000] hover:text-gray-700']">Settings</NuxtLink>
            </li>
            <li>
              <button v-if="!isAuthenticated" @click="toggleLoginPopup" :class="['font-medium transition-colors duration-300', hasScrolled ? 'text-white hover:text-gray-200' : 'text-[#000000] hover:text-gray-700']">
                Login
              </button>
              <button v-else @click="handleLogout" :class="['font-medium transition-colors duration-300', hasScrolled ? 'text-white hover:text-gray-200' : 'text-[#000000] hover:text-gray-700']">
                Logout
              </button>
            </li>
            <li>
              <select :class="['bg-transparent border-none focus:ring-0 cursor-pointer font-medium transition-colors duration-300', hasScrolled ? 'text-white hover:text-gray-200' : 'text-[#000000] hover:text-gray-700']">
                <option value="EN" selected>EN</option>
                <option value="FRA">FRA</option>
              </select>
            </li>
          </ul>
        </div>
      </nav>
      <button class="lg:hidden block" @click="mobileMenuOpen = true">
        <Icon name="heroicons:bars-3" :class="['w-6 h-6 transition-colors duration-300', hasScrolled ? 'text-white' : 'text-[#212832]']" />
      </button>

      <!-- Mobile menu -->
      <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
        <div class="fixed inset-0 z-50 bg-black/30" />
        <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
          <div class="flex items-center justify-between">
            <Logo :hasScrolled="hasScrolled" />
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <NuxtLink to="/visitor/about" class="-mx-3 block rounded-lg px-3 py-2 text-[#6C63FF] hover:text-[#857EFF] transition-colors duration-300">
                  About
                </NuxtLink>
                <NuxtLink to="/visitor/contact" class="-mx-3 block rounded-lg px-3 py-2 text-[#6C63FF] hover:text-[#857EFF] transition-colors duration-300">
                  Contact
                </NuxtLink>
                <NuxtLink v-if="isAuthenticated && userRole === 1" to="/" class="-mx-3 block rounded-lg px-3 py-2 text-[#6C63FF] hover:text-[#857EFF] transition-colors duration-300">
                  Dashboard
                </NuxtLink>
                <NuxtLink v-if="isAuthenticated" to="/settings" class="-mx-3 block rounded-lg px-3 py-2 text-[#6C63FF] hover:text-[#857EFF] transition-colors duration-300">
                  Settings
                </NuxtLink>
              </div>
              <div class="py-6">
                <button v-if="!isAuthenticated" @click="toggleLoginPopup" class="-mx-3 block rounded-lg px-3 py-2.5 text-[#6C63FF] hover:text-[#857EFF] transition-colors duration-300">
                  Login
                </button>
                <button v-else @click="handleLogout" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>

    <!-- Login Popup -->
    <LoginPopup 
      v-if="loginPopupOpen" 
      :isOpen="loginPopupOpen" 
      @close="closeLoginPopup"
      @userLoggedIn="handleUserLoggedIn" 
    />
  </header>
</template>