<script setup lang="ts">
useHead({
  title: 'FlatBuy — Interior Works Guide',
  meta: [
    { name: 'description', content: 'Interior works hub: false ceiling, carpenter works, painting, electrical, plumbing, tiles and lighting — one guide page per trade with indicative costs and traps.' },
  ],
})

type Trade = { path: string, label: string, icon: string, blurb: string, highlight?: string }

const trades: Trade[] = [
  {
    path: '/false-ceiling',
    label: 'False Ceiling',
    icon: 'i-ph-grid-four',
    blurb: 'Full cost breakdown for any room size, and the brand checklist that keeps your ceiling crack-free.',
    highlight: 'From the video breakdown',
  },
  {
    path: '/carpentry',
    label: 'Carpenter Works',
    icon: 'i-ph-hammer',
    blurb: 'Wardrobes, modular kitchen, TV unit and furniture — material & finish tiers, labor-only route, hardware gotchas.',
    highlight: 'Biggest line item',
  },
  {
    path: '/painting',
    label: 'Painting',
    icon: 'i-ph-paint-brush',
    blurb: 'Putty + primer + emulsion packages, premium finishes and accent walls — and the brand/coat downgrades to watch.',
  },
  {
    path: '/electrical',
    label: 'Electrical',
    icon: 'i-ph-lightning',
    blurb: 'Per-point rates, wiring and switch brands, the false-ceiling wiring gotcha and point counts by flat size.',
  },
  {
    path: '/plumbing',
    label: 'Plumbing',
    icon: 'i-ph-drop',
    blurb: 'Per-point rates for the kitchen and baths, pipe and fitting brands, typical 2BHK counts.',
  },
  {
    path: '/tiles',
    label: 'Tiles & Flooring',
    icon: 'i-ph-checkerboard',
    blurb: 'Material vs laying bills for vitrified, wall tiles and large-format finishes.',
  },
  {
    path: '/lighting',
    label: 'Lights & Fittings',
    icon: 'i-ph-lamp',
    blurb: 'LED panels, cove strips and the full-flat fixture budget.',
  },
  {
    path: '/kitchen-fittings',
    label: 'Kitchen Fittings',
    icon: 'i-ph-fork-knife',
    blurb: 'Counter, backsplash, chimney, hob and sink — the items "full kitchen" quotes exclude.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-paint-roller" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Interior Works Guide
              </h1>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ColorModeButton />
            <UButton to="/" variant="outline" color="neutral" icon="i-ph-calculator" size="sm">
              Calculator
            </UButton>
          </div>
        </div>
        <p class="mt-3 text-sm text-muted max-w-2xl">
          Every interior trade gets its own guide page — costs, brands, rates and where contractors fool
          people. Rates are indicative Indian metro pricing; verify quotes in your city.
        </p>
      </header>

      <div class="grid sm:grid-cols-2 gap-4 mb-8">
        <NuxtLink
          v-for="trade in trades"
          :key="trade.path"
          :to="trade.path"
          class="rounded-xl border border-default p-4 hover:bg-elevated/50 transition-colors group"
        >
          <div class="flex items-start gap-3">
            <div class="flex items-center justify-center size-10 rounded-lg bg-elevated text-primary shrink-0 group-hover:bg-primary group-hover:text-inverted transition-colors">
              <UIcon :name="trade.icon" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <h2 class="font-semibold text-highlighted">{{ trade.label }}</h2>
                <UIcon name="i-ph-arrow-right" class="size-4 text-muted shrink-0" />
              </div>
              <p class="text-xs sm:text-sm text-muted mt-1">{{ trade.blurb }}</p>
              <UBadge
                v-if="trade.highlight"
                color="neutral"
                variant="soft"
                size="sm"
                class="mt-2"
              >
                {{ trade.highlight }}
              </UBadge>
            </div>
          </div>
        </NuxtLink>
      </div>

      <section class="rounded-xl border border-default p-4 sm:p-5">
        <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
          <UIcon name="i-ph-tip" class="size-5 text-primary" />How interior budgets overshoot — and how to prevent it
        </h2>
        <ul class="space-y-3">
          <li class="flex gap-2.5 text-sm">
            <UBadge color="error" variant="soft" class="shrink-0 mt-0.5">1</UBadge>
            <span><strong class="text-highlighted">Ask what's excluded, not just the total.</strong> Electrical, plumbing, hardware, chimney and counter are routinely left out of a "full interior" quote — then billed later.</span>
          </li>
          <li class="flex gap-2.5 text-sm">
            <UBadge color="error" variant="soft" class="shrink-0 mt-0.5">2</UBadge>
            <span><strong class="text-highlighted">Get brands written down.</strong> Board grade, paint brand, wire brand, hinges — the same rate with different brands is not the same quote.</span>
          </li>
          <li class="flex gap-2.5 text-sm">
            <UBadge color="error" variant="soft" class="shrink-0 mt-0.5">3</UBadge>
            <span><strong class="text-highlighted">Measurements decide the bill.</strong> Area-based billing hides inflation — where possible, agree running-foot rates for narrow strips and per-unit rates for furniture.</span>
          </li>
          <li class="flex gap-2.5 text-sm">
            <UBadge color="error" variant="soft" class="shrink-0 mt-0.5">4</UBadge>
            <span><strong class="text-highlighted">Stage the payments.</strong> Never pay more than 30–40% upfront; tie each payment to finished, verifiable work.</span>
          </li>
        </ul>
      </section>

      <footer class="mt-10 text-center text-xs text-muted">
        <NuxtLink to="/guide" class="text-primary hover:underline">More buying guides</NuxtLink>
      </footer>
    </UContainer>
  </div>
</template>
