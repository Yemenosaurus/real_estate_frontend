<template>
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div class="flex justify-center mb-6">
            <Logo class="w-32 h-32" />
        </div>
        <form @submit.prevent="$emit('login')">
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" v-model="email"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required>
            </div>
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" v-model="password"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required>
            </div>
            <button type="submit"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700">Login</button>
        </form>
        <div class="mt-4 text-center">
            <a href="#" class="text-sm text-indigo-600 hover:underline">Forgot your password?</a>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default'
})

import Logo from '~/components/global/Logo.vue'
</script>

<style scoped>
/* Styles pour la page de connexion (si nécessaire) */
</style>