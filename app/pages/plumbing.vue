<script setup lang="ts">
useHead({
  title: 'FlatBuy — Plumbing Works Guide',
  meta: [
    { name: 'description', content: 'Plumbing cost guide: per-point rates, pipe and fitting brands, and the typical point count for a 2BHK kitchen and bathrooms.' },
  ],
})

const points = ref(10)
const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
const total = computed(() => Math.max(1, points.value) * 600)
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-drop" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Plumbing Works
              </h1>
            </div>
          </div>
          <div class="flex gap-2">
            <UButton to="/interiors" variant="outline" color="neutral" size="sm" icon="i-ph-arrow-left">
              <span class="hidden sm:inline">Interiors</span>
            </UButton>
            <UButton to="/" variant="outline" color="neutral" size="sm" icon="i-ph-calculator">
              <span class="hidden sm:inline">Calculator</span>
            </UButton>
          </div>
        </div>
        <p class="mt-3 text-sm text-muted max-w-2xl">
          Plumbing during interiors means adding or shifting points — sink, RO, dishwasher, geysers and
          health faucets — billed per point like electrical.
        </p>
      </header>

      <div class="rounded-xl border border-default p-4 sm:p-5 mb-8">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-ph-ruler" class="size-5 text-primary" />
          <h2 class="font-semibold text-highlighted">Quick estimate</h2>
        </div>
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label for="pl-points" class="block text-xs text-muted mb-1">Plumbing points</label>
            <UInputNumber
              id="pl-points"
              v-model="points"
              :min="2"
              :max="60"
              :step="1"
              class="w-32"
            />
          </div>
          <UBadge color="neutral" variant="soft" size="lg" class="mb-0.5 tabular-num">
            ≈ {{ fmt(total) }} @ ₹600/point
          </UBadge>
        </div>
      </div>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-list-checks" class="size-5 text-primary" />What to know
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Per point:</strong> ₹500–700 including CPVC piping (Supreme / Ashirvad) and standard CP fittings (Jaquar / Kohler if premium).</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">A 2BHK kitchen + 2 baths:</strong> typically 8–10 points (sink, RO, dishwasher, geyser, health faucets, washpoints).</span>
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
