import { defineNuxtPlugin } from '#app'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const posthogClient = posthog.init('phc_seMfUMjhRePpvKFyTHqD7LfTLJDr4XqDzcmM8N4Tgo2Q', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    loaded: (instance) => {
      if (import.meta.env.MODE === 'development') instance.debug()
    }
  })

  return {
    provide: {
      posthog: () => posthogClient
    }
  }
})