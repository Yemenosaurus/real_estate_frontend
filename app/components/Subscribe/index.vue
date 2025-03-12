<template>
    <section class="p-6 sm:p-20 font-poppins">
      <div
        class="w-full max-w-[1170px] mx-auto bg-[#9E98FF] bg-opacity-20 rounded-tl-[129px] rounded-[20px] p-16 relative"
      >
        <div class="absolute -right-10 -top-10">
          <Icon name="send-2" class="w-[70px] h-[70px] text-[#857EFF]" />
        </div>
        <div class="absolute right-52 bottom-0">
          <Icon name="send-3" class="w-[70px] h-[70px] text-[#6C63FF]" />
        </div>
        <div class="text-center space-y-12 max-w-[880px] mx-auto">
          <p class="text-[#14183E] text-[33px] font-semibold">
            Subscribe to receive insights and updates on optimizing and enhancing your property experience with us.
          </p>
          <div class="flex items-center space-x-6">
            <div class="relative w-full max-w-[421px]">
              <input
                v-model="email"
                type="email"
                placeholder="Your email"
                class="w-full h-[68px] rounded-xl px-16 border-2 border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-300"
                :class="{ 'border-red-500': error }"
              />
              <Icon
                name="email"
                class="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-[#6C63FF]"
              />
            </div>
            <button
              @click="subscribe"
              :disabled="isLoading"
              class="h-[68px] px-12 bg-gradient-to-t from-[#6C63FF] via-[#857EFF] to-[#9E98FF] text-white rounded-xl disabled:opacity-50 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span v-if="!isLoading">Subscribe</span>
              <span v-else>Loading...</span>
            </button>
          </div>
          <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
          <p v-if="success" class="text-green-500 mt-2">{{ success }}</p>
        </div>
      </div>
    </section>
  </template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

async function subscribe() {
  if (!email.value) {
    error.value = 'Please enter your email address';
    return;
  }

  error.value = '';
  success.value = '';
  isLoading.value = true;

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/newsletter/subscribe', {
      email: email.value
    });
    
    success.value = response.data.message;
    email.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script> 