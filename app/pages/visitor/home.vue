<template>
  <div class="visitor-page flex flex-col space-y-20">
    <!-- Sections principales -->
    <Suspense>
      <template #default>
        <Hero />
      </template>
      <template #fallback>
        <div class="flex items-center justify-center h-screen">
          <span class="loading">Loading...</span>
        </div>
      </template>
    </Suspense>
    <Category />
    <Destinations />
    <Form />
    <Bookings />
    <Testimonials />
    <Companies />
    <Subscribe />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'visitor'
})

// Importation des composants
import Hero from '~/components/Hero/index.vue'
import Category from '~/components/Category/index.vue'
import Destinations from '~/components/Destinations/index.vue'
import Bookings from '~/components/Bookings/index.vue'
import Testimonials from '~/components/Testimonials/index.vue'
import Companies from '~/components/Companies/index.vue'
import Subscribe from '~/components/Subscribe/index.vue'

// Meta pour la page
useHead({
  title: 'Corevia Estate',
  // meta: [
  //   { name: 'description', content: 'Corevia Estate is a real estate agency landing page built with Nuxt 3 and TailwindCSS.' }
  // ]
})
</script>

<style>
.visitor-page {
  /* Modification du style existant pour s'adapter au nouveau contenu */
  position: relative; /* Changed from fixed to relative */
  width: 100%;
  min-height: 100vh;
  background: white;
  z-index: 1; /* Changed from 9999 to 1 */
}

.visitor-title {
  color: black;
  font-size: 2rem;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.loading {
  @apply text-gray-600 text-lg;
}

/* Optimisation pour le scroll smooth */
html {
  scroll-behavior: smooth;
}

/* Optimisation pour le responsive */
@media (max-width: 640px) {
  .container {
    @apply px-4;
  }
}
</style>