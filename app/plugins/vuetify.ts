// plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#6C63FF',
            secondary: '#5E6282',
            accent: '#14183E',
            background: '#f8f9fa',
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
