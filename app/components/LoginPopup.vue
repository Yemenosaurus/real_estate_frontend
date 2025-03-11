<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg flex w-3/4 max-w-3xl relative">
      <button @click="closePopup" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <span class="sr-only">Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="flex-1 p-8">
        <h2 class="text-2xl font-bold mb-4">Login</h2>
        <form v-if="!loginSuccess" @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" v-model="password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
          </div>
          <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700">Login</button>
        </form>
        <div v-else class="flex items-center justify-center flex-col">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-lg font-semibold text-green-500 mt-4">Connexion réussie</p>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center bg-gray-100">
        <Logo class="w-32 h-32" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import Logo from '~/components/global/Logo.vue';
import axios from 'axios';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'userLoggedIn']);

const email = ref('a@a.com');
const password = ref('a');
const loginSuccess = ref(false);

function closePopup() {
  emit('close');
}

async function handleLogin() {
  // try {
    await axios.get('http://127.0.0.1:8000/api/sanctum/csrf-cookie');
    const loginResponse = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value
    });
    console.log('Login successful:', loginResponse.data);
    
    const userId = loginResponse.data.user.id;
    localStorage.setItem('userId', userId);
    
    const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${userId}`);
    console.log('User data received:', userResponse.data);
    
    emit('userLoggedIn', userResponse.data.user);
    
    loginSuccess.value = true;
    
    setTimeout(() => {
      closePopup();
    }, 1500);

  // } catch (error) {
  //   console.error('Login failed:', error.response?.data);
  // }
}
</script>

<style scoped>
/* Styles pour le pop-up de connexion */
</style>
