<script setup lang="ts">
useHead({
  title: 'FlatBuy — Kitchen Fittings Guide',
  meta: [
    { name: 'description', content: 'Kitchen fittings cost guide: counter tops (granite vs quartz), backsplash, chimney, hob, sink and hardware — what is usually excluded from carpentry quotes.' },
  ],
})

const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
const kitchenItems = [
  { item: 'Counter top — granite', basis: '~45 sq ft @ ₹180–280/sq ft', cost: 10000 },
  { item: 'Counter top — quartz (upgrade)', basis: '~45 sq ft @ ₹350–700/sq ft', cost: 25000 },
  { item: 'Backsplash tiles (2 ft band)', basis: '~30 sq ft incl. laying', cost: 6000 },
  { item: 'Chimney + hob', basis: 'Auto-clean chimney + 3-burner', cost: 35000 },
  { item: 'Sink + waste basket', basis: 'Single/double bowl SS or quartz', cost: 12000 },
]
const kitchenBasic = kitchenItems
  .filter(i => !i.item.startsWith('Counter top — quartz'))
  .reduce((s, i) => s + i.cost, 0)
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-fork-knife" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Kitchen Fittings
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
          Counter, backsplash, chimney, hob and sink — these are exactly the items a "full modular kitchen"
          quote tends to exclude, then bill later.
        </p>
      </header>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-receipt" class="size-5 text-primary" />Typical scope & cost
          </h2>
          <div class="overflow-x-auto rounded-xl border border-default">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/40">
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Item</th>
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Typical basis</th>
                  <th class="text-right py-2.5 px-4 font-medium text-muted">Est. cost</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="ki in kitchenItems"
                  :key="ki.item"
                  class="border-b border-default/50"
                >
                  <td class="py-2.5 px-4">{{ ki.item }}</td>
                  <td class="py-2.5 px-4 text-muted">{{ ki.basis }}</td>
                  <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(ki.cost) }}</td>
                </tr>
                <tr class="bg-elevated/40">
                  <td class="py-2.5 px-4 font-semibold" colspan="2">Basic kitchen fittings total (granite)</td>
                  <td class="py-2.5 px-4 text-right tabular-num font-bold text-highlighted">{{ fmt(kitchenBasic) }}</td>
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
