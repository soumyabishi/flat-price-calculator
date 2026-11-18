<script setup lang="ts">
useHead({
  title: 'FlatBuy — Painting Guide',
  meta: [
    { name: 'description', content: 'Interior painting cost guide: full package per-sq-ft rates, premium emulsions, texture walls, and how contractors quietly down grade coats and brands.' },
  ],
})

const area = ref(1000)
const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
const fullPackage = computed(() => Math.max(1, area.value) * 26)
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-paint-brush" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Painting
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
          The full painting package is 2 putty coats + 1 primer + 2 emulsion coats on walls and ceiling.
        </p>
      </header>

      <div class="rounded-xl border border-default p-4 sm:p-5 mb-8">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-ph-ruler" class="size-5 text-primary" />
          <h2 class="font-semibold text-highlighted">Paintable area</h2>
        </div>
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label for="pt-area" class="block text-xs text-muted mb-1">Carpet area (sq ft)</label>
            <UInputNumber
              id="pt-area"
              v-model="area"
              :min="300"
              :max="5000"
              :step="50"
              class="w-32"
            />
          </div>
          <UBadge color="neutral" variant="soft" size="lg" class="mb-0.5 tabular-num">
            Basic package ≈ {{ fmt(fullPackage) }}
          </UBadge>
        </div>
        <p class="mt-3 text-xs text-dimmed">
          Wall + ceiling paintable area is roughly 3× carpet area; rates below already account for that.
        </p>
      </div>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-receipt" class="size-5 text-primary" />Rates
          </h2>
          <div class="overflow-x-auto rounded-xl border border-default">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/40">
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Scope</th>
                  <th class="text-center py-2.5 px-4 font-medium text-muted">Covers</th>
                  <th class="text-right py-2.5 px-4 font-medium text-muted">Rate / sq ft</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Full package — 2 putty coats + primer + 2 emulsion coats</td>
                  <td class="py-2.5 px-4 text-center text-muted">Walls + ceiling</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹22–30</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Premium emulsion (Asian Royale / Berger Silk)</td>
                  <td class="py-2.5 px-4 text-center text-muted">Washable walls</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹30–40</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-4">Texture / Royale Play accent walls</td>
                  <td class="py-2.5 px-4 text-center text-muted">Accent wall only</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹60–120</td>
                </tr>
              </tbody>
            </table>
          </div>
          <UAlert
            icon="i-ph-warning-circle"
            color="warning"
            variant="soft"
            class="mt-3"
            title="Check the brand and coats"
            description="Quotes vary wildly because contractors quietly downgrade paint brand or drop a putty coat. Insist on sealed putty buckets and named paint brands (Asian, Berger, Dulux) in the quote."
          />
        </section>
      </div>

      <footer class="mt-10 text-center text-xs text-muted">
        Rates are indicative Indian metro pricing ·
        <NuxtLink to="/interiors" class="text-primary hover:underline">All interior guides</NuxtLink>
      </footer>
    </UContainer>
  </div>
</template>
