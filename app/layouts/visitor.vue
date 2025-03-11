<script setup>
import Footer from '~/components/global/Footer.vue';
import LoginPopup from '~/components/LoginPopup.vue';
import { ref } from 'vue';

// Importation explicite de useHead
import { useHead } from '#imports'

// Configuration du head
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  // meta: [
    // { charset: 'utf-8' },
    // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // { property: 'og:title', content: 'Corevia Estate' },
    // { name: 'description', content: 'Corevia Estate is a real estate agency landing page built with Nuxt 3 and TailwindCSS.' },
    // { property: 'og:description', content: 'Corevia Estate is a real estate agency landing page built with Nuxt 3 and TailwindCSS.' },
    // { property: 'og:url', content: 'https://corevia-estate.com/' },
    // { name: 'twitter:title', content: 'Corevia Estate' },
    // { name: 'twitter:description', content: 'Corevia Estate is a real estate agency landing page built with Nuxt 3 and TailwindCSS.' },
    // { name: 'twitter:site', content: 'https://corevia-estate.com/' }
  // ],
    title: 'Corevia Estate',
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})

const loginPopupOpen = ref(false);
</script>

<template>
  <main class="max-w-8xl">
    <slot/>
    <LoginPopup v-if="loginPopupOpen" :isOpen="loginPopupOpen" @close="loginPopupOpen = false" />
    <Footer />
  </main>
</template>

<style>
/* Reset TOUS les styles globaux */
body, html {
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
}

/* Réinitialisation complète du layout visiteur */
.visitor-layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 9999;
}

/* Assurer que tous les éléments enfants sont également réinitialisés */
.visitor-layout * {
  all: revert;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.visitor-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.visitor-title {
  color: black;
  font-size: 2rem;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

/* Si des styles supplémentaires sont nécessaires */
.max-w-8xl {
  max-width: 1440px;
  margin: 0 auto;
}
</style> 