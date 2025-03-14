export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],

  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
  ],

  plugins: [
    '~/plugins/vuetify'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://127.0.0.1:8000'
    },
  },

  app: {
    head: {
      title: 'Real Estate',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  devtools: {
    enabled: true,
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    disableTransition: true,
  },

  ui: {
    safelistColors: ["primary", "red", "orange", "green"],
    primary: 'indigo',
  },

  routeRules: {
    // "/": { redirect: '/login' },
  },

  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-07-11",

  typescript: {
    strict: false,
    typeCheck: false
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
