export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],

  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/fonts",

  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://127.0.0.1:8000'
    },
  },

  devtools: {
    enabled: true,
  },

  colorMode: {
    disableTransition: true,
  },

  ui: {
    safelistColors: ["primary", "red", "orange", "green"],
  },

  routeRules: {
    // "/": { redirect: '/login' },
  },

  ssr: true,

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-07-11",

  typescript: {
    strict: false,
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    config: {
      theme: {
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
          'volkhov': ['Volkhov', 'serif']
        }
      }
    }
  },

  build: {
    transpile: ['vue-echarts', 'echarts/core']
  }
})
