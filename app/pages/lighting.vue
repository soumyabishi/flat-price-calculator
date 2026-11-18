<script setup lang="ts">
useHead({
  title: 'FlatBuy — Lights & Fittings Guide',
  meta: [
    { name: 'description', content: 'Lighting cost guide: concealed LED panels, cove strip lights, chandeliers and full-flat lighting budgets for 2–3BHK flats.' },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-lamp" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Lights & Fittings
              </h1>
            </div>
          </div>
          <div class="flex gap-2">
            <ColorModeButton />
            <UButton to="/interiors" variant="outline" color="neutral" size="sm" icon="i-ph-arrow-left">
              <span class="hidden sm:inline">Interiors</span>
            </UButton>
            <UButton to="/" variant="outline" color="neutral" size="sm" icon="i-ph-calculator">
              <span class="hidden sm:inline">Calculator</span>
            </UButton>
          </div>
        </div>
        <p class="mt-3 text-sm text-muted max-w-2xl">
          Fixtures are usually the last line item and the easiest to control — buy panels and strips yourself,
          pay an electrician only for fitting.
        </p>
      </header>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-list-checks" class="size-5 text-primary" />What to know
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Concealed LED panels:</strong> ₹150–350 each (warm white for living, cool for kitchen/bath).</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Cove strip lights:</strong> ~₹100/metre — a 10×10 room uses about 10 m.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Full-flat budget:</strong> ₹25,000–40,000 for panels, strips, chandeliers and bathroom mirror lights in a 2–3BHK.</span>
            </li>
          </ul>
        </section>
      </div>

      <footer class="mt-10 text-center text-xs text-muted">
        Rates are indicative Indian metro pricing ·
        <NuxtLink to="/interiors" class="text-primary hover:underline">All interior guides</NuxtLink>
      </footer>
    </UContainer>
  </div>
</template>
