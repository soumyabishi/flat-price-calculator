<script setup lang="ts">
useHead({
  title: 'FlatBuy — Electrical Works Guide',
  meta: [
    { name: 'description', content: 'Electrical works cost guide: per-point rates, wiring and switch brands, the false-ceiling wiring gotcha and typical point counts flat by flat.' },
  ],
})

const points = ref(24)
const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
const total = computed(() => Math.max(1, points.value) * 450)
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-lightning" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Electrical Works
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
          Electrical work is billed per point — and the false-ceiling wiring is billed separately from the
          ceiling itself, which surprises people every time.
        </p>
      </header>

      <div class="rounded-xl border border-default p-4 sm:p-5 mb-8">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-ph-ruler" class="size-5 text-primary" />
          <h2 class="font-semibold text-highlighted">Quick estimate</h2>
        </div>
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label for="el-points" class="block text-xs text-muted mb-1">Electrical points</label>
            <UInputNumber
              id="el-points"
              v-model="points"
              :min="6"
              :max="200"
              :step="1"
              class="w-32"
            />
          </div>
          <UBadge color="neutral" variant="soft" size="lg" class="mb-0.5 tabular-num">
            ≈ {{ fmt(total) }} @ ₹450/point
          </UBadge>
        </div>
        <p class="mt-3 text-xs text-dimmed">
          Rule of thumb: ~12 points per 100 sq ft of carpet area (a 1,000 sq ft flat ≈ 24 points).
        </p>
      </div>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-list-checks" class="size-5 text-primary" />What to know
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Per point:</strong> ₹350–500 per point including conduit, wiring (Polycab / Finolex / Havells) and modular switches (Legrand / Schneider / Anchor Roma).</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Hidden inside false ceiling:</strong> the wiring for cove lights and spotlights is billed with the ceiling electrical (₹95–100/sq ft on gypsum) — people are surprised by it every time.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-arrow-right" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Point math on false ceilings:</strong> labor ~₹90/point, wiring/piping ~₹340/point, LED light ~₹220/point — for a 10×10 room the video worked out 12 points ≈ ₹8,800 including strip lights.</span>
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
