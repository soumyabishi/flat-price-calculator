<script setup lang="ts">
useHead({
  title: 'FlatBuy — Tiles & Flooring Guide',
  meta: [
    { name: 'description', content: 'Tiles and flooring cost guide: material prices and laying labor rates for vitrified floors, wall tiles and large-format / marble-look finishes.' },
  ],
})

const area = ref(1000)
const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
// Basic vitrified: ~₹40/sq ft material (budget) + ₹50 labor
const basicTotal = computed(() => Math.max(1, area.value) * 90)
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-checkerboard" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Tiles & Flooring
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
          Two bills per floor: the tiles themselves (material) and the laying charge (labor). Flats usually
          arrive with floors done — this applies when you're re-doing or tiling balconies/kitchens.
        </p>
      </header>

      <div class="rounded-xl border border-default p-4 sm:p-5 mb-8">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-ph-ruler" class="size-5 text-primary" />
          <h2 class="font-semibold text-highlighted">Quick estimate</h2>
        </div>
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label for="tl-area" class="block text-xs text-muted mb-1">Tile area (sq ft)</label>
            <UInputNumber
              id="tl-area"
              v-model="area"
              :min="50"
              :max="5000"
              :step="50"
              class="w-32"
            />
          </div>
          <UBadge color="neutral" variant="soft" size="lg" class="mb-0.5 tabular-num">
            Basic vitrified ≈ {{ fmt(basicTotal) }}
          </UBadge>
        </div>
        <p class="mt-3 text-xs text-dimmed">
          Basic estimate = ~₹40/sq ft budget vitrified + ₹50/sq ft laying.
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
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Material</th>
                  <th class="text-right py-2.5 px-4 font-medium text-muted">Laying labor</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Floor tiles — vitrified</td>
                  <td class="py-2.5 px-4 text-muted">₹50–150/sq ft (Kajaria, Somany, Johnson)</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹40–60/sq ft</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Wall tiles — kitchen & bath</td>
                  <td class="py-2.5 px-4 text-muted">₹40–100/sq ft</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹45–65/sq ft</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-4">Large-format / marble look</td>
                  <td class="py-2.5 px-4 text-muted">₹120–250/sq ft</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹70–100/sq ft</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <footer class="mt-10 text-center text-xs text-muted">
        Rates are indicative Indian metro pricing ·
        <NuxtLink to="/interiors" class="text-primary hover:underline">All interior guides</NuxtLink>
      </footer>
    </UContainer>
  </div>
</template>
