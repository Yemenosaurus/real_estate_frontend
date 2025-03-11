<template>
  <div class="visitor-page flex flex-col space-y-20">
    <!-- Header -->
    <Header />

    <!-- Contenu principal de la page Contact -->
    <main class="contact-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-bold text-gray-900">Contact Us</h1>
      <p class="mt-4 text-lg text-gray-600">
        We would love to hear from you! Please fill out the form below to get in touch with us.
      </p>
      <!-- Ajoutez ici le formulaire de contact ou d'autres informations de contact -->
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

.contact-content {
  padding: 20px;
}
</style> 