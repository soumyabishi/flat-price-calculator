<script setup lang="ts">
useHead({
  title: 'FlatBuy — Carpenter Works Guide',
  meta: [
    { name: 'description', content: 'Carpenter works cost guide: wardrobes, modular kitchen, TV unit, bed and furniture — material and finish tiers, labor-only vs contractor routes and hardware gotchas.' },
  ],
})

const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

/* Carpentry is unit-based, not area-based — a 2BHK and a 3BHK of the same
   carpet area need roughly the same wardrobes. These are typical 2–3BHK picks. */
const carpentryItems = [
  { item: 'Wardrobe ×2 (8 ft × 2.5 ft, loft included)', basis: '~40 sq ft @ ₹1,400–1,600/sq ft', cost: 62000 },
  { item: 'Modular kitchen (base + wall + tall units)', basis: '~12 running ft @ ₹1,400–1,700/rft', cost: 60000 },
  { item: 'Kitchen counter (granite) + backsplash', basis: '~45 sq ft counter @ ₹200–280/sq ft', cost: 18000 },
  { item: 'TV / entertainment unit', basis: '~40 sq ft @ ₹500–700/sq ft', cost: 25000 },
  { item: 'Bed with box storage (queen)', basis: 'Carcass + shutter, laminate finish', cost: 45000 },
  { item: 'Study / work table', basis: '~20 sq ft @ ₹700/sq ft', cost: 14000 },
  { item: 'Shoe rack / crockery unit / misc', basis: 'Per design', cost: 20000 },
]
const carpentryTotal = carpentryItems.reduce((sum, i) => sum + i.cost, 0)
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-hammer" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Carpenter Works
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
          Carpentry is usually the single biggest interior line item. Rates depend on the board material and
          the shutter finish — always ask which of each is quoted.
        </p>
      </header>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-receipt" class="size-5 text-primary" />Typical carpentry scope & cost
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
                  v-for="ci in carpentryItems"
                  :key="ci.item"
                  class="border-b border-default/50"
                >
                  <td class="py-2.5 px-4">{{ ci.item }}</td>
                  <td class="py-2.5 px-4 text-muted">{{ ci.basis }}</td>
                  <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(ci.cost) }}</td>
                </tr>
                <tr class="bg-elevated/40">
                  <td class="py-2.5 px-4 font-semibold" colspan="2">Carpentry total</td>
                  <td class="py-2.5 px-4 text-right tabular-num font-bold text-highlighted">{{ fmt(carpentryTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-stack" class="size-5 text-primary" />Material & finish tiers
          </h2>
          <div class="overflow-x-auto rounded-xl border border-default">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/40">
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Finish</th>
                  <th class="text-left py-2.5 px-4 font-medium text-muted">What it is</th>
                  <th class="text-right py-2.5 px-4 font-medium text-muted">Rate / sq ft</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4 font-medium">MDF + laminate</td>
                  <td class="py-2.5 px-4 text-muted">Budget option; weaker than ply, fine for shutters</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹1,100–1,300</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4 font-medium">Plywood + laminate</td>
                  <td class="py-2.5 px-4 text-muted">BWR/MR grade ply carcass — the standard choice</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹1,300–1,600</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4 font-medium">HDHMR / BWP ply + laminate</td>
                  <td class="py-2.5 px-4 text-muted">Moisture-resistant upgrade for kitchen cabinets</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹1,400–1,700</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4 font-medium">PU / Duco paint</td>
                  <td class="py-2.5 px-4 text-muted">Sprayed matte finish, premium look</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹1,800–2,400</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-4 font-medium">Acrylic / imported laminate</td>
                  <td class="py-2.5 px-4 text-muted">High-gloss shutters</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹1,900–2,400</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-hand-coins" class="size-5 text-primary" />Labor, hardware & tips
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Labor-only option:</strong> hiring a carpenter directly — ₹700–1,000/day or ₹300–450/sq ft — and buying material yourself can save 20–25%.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Hardware:</strong> hinges, channels and handles (Hettich, Hafele, Ebco) are quoted separately — a wardrobe's hardware alone runs ₹3,000–8,000. Ask what's included.</span>
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
