// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'system',
    fallback: 'dark'
  },
  fonts: {
    families: [{ name: 'Figtree', provider: 'google' }]
  },
  css: ['~/assets/css/main.css']
})