// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  app: {
    head: {
      title: 'FlatBuy — All-inclusive cost calculator',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'system',
    fallback: 'dark'
  },
  fonts: {
    families: [
      { name: 'Figtree', provider: 'google' }
    ]
  },
  css: ['~/assets/css/main.css']
})