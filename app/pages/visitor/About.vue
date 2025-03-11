<template>
  <div class="visitor-page flex flex-col space-y-20">
    <!-- Header -->
    <Header />

    <!-- Contenu principal de la page About -->
    <main class="about-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-bold text-gray-900">About Us</h1>
      <p class="mt-4 text-lg text-gray-600">
        Welcome to our company. We are dedicated to providing the best service possible.
        Our team is committed to excellence and innovation in every project we undertake.
      </p>
      <p class="mt-4 text-lg text-gray-600">
        Our mission is to deliver high-quality solutions that meet the needs of our clients.
        We believe in building long-term relationships based on trust and mutual respect.
      </p>
      <!-- Ajoutez plus de contenu ici -->
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/hero/Header.vue';

definePageMeta({
  layout: 'visitor'
})
</script>

<style scoped>
.visitor-page {
  width: 100%;
  min-height: 100vh;
  background: white;
}

.about-content {
  padding: 20px;
}
</style> 