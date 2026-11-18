<script setup lang="ts">
useHead({
  title: 'FlatBuy — Gypsum False Ceiling Guide',
  meta: [
    { name: 'description', content: 'Gypsum false ceiling: cost breakdown for any room size, board and material brand checklist, and where contractors cut costs and fool you.' },
  ],
})

const roomLength = ref(10)
const roomWidth = ref(10)

const area = computed(() => Math.max(1, Math.round((roomLength.value || 0) * (roomWidth.value || 0))))
const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-grid-four" class="size-5 sm:size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy · Interiors</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Gypsum False Ceiling
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
          Costs, brands and the spots contractors silently cut — everything from the
          <a
            href="https://www.youtube.com/watch?v=G_DU06719AI"
            target="_blank"
            rel="noopener"
            class="text-primary hover:underline"
          >gypsum false ceiling explainer</a>
          (unaffiliated).
        </p>
      </header>

      <!-- Room size controls -->
      <div class="rounded-xl border border-default p-4 sm:p-5 mb-8">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-ph-ruler" class="size-5 text-primary" />
          <h2 class="font-semibold text-highlighted">Your room</h2>
        </div>
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label for="fc-length" class="block text-xs text-muted mb-1">Length (ft)</label>
            <UInputNumber
              id="fc-length"
              v-model="roomLength"
              :min="4"
              :max="60"
              :step="1"
              class="w-28"
            />
          </div>
          <span class="pb-2.5 text-muted">×</span>
          <div>
            <label for="fc-width" class="block text-xs text-muted mb-1">Width (ft)</label>
            <UInputNumber
              id="fc-width"
              v-model="roomWidth"
              :min="4"
              :max="60"
              :step="1"
              class="w-28"
            />
          </div>
          <UBadge color="neutral" variant="soft" size="lg" class="mb-0.5 tabular-num">
            {{ area.toLocaleString('en-IN') }} sq ft
          </UBadge>
        </div>
      </div>

      <div class="space-y-8">
        <!-- 1. What it is -->
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-1 flex items-center gap-2">
            <UIcon name="i-ph-wall" class="size-5 text-primary" />1. What a gypsum false ceiling is
          </h2>
          <p class="text-sm text-muted">
            Readymade gypsum boards (12.5 mm thick; 6×4, 8×4 or 10×4 ft) fixed on metal channel framing
            below the slab. You can make almost any design you want — simple or modern.
          </p>
        </section>

        <!-- 2. Cost -->
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-1 flex items-center gap-2">
            <UIcon name="i-ph-coins" class="size-5 text-primary" />2. Cost breakdown
          </h2>
          <p class="text-sm text-muted mb-3">
            Contractors quote only the first line — electrical and painting always come on top.
          </p>
          <div class="overflow-x-auto rounded-xl border border-default">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/40">
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Item</th>
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Rate</th>
                  <th class="text-right py-2.5 px-4 font-medium text-muted">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Boards + metal channels + labor (finished work)</td>
                  <td class="py-2.5 px-4 text-muted">₹70–80 / sq ft</td>
                  <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(area * 80) }}</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">
                    Electrical — conduit pipes, quality wires (Polycab / HLS), concealed + LED strip lights
                  </td>
                  <td class="py-2.5 px-4 text-muted">₹95–100 / sq ft</td>
                  <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(area * 95) }}</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Painting — 1 coat primer + 1 coat paint</td>
                  <td class="py-2.5 px-4 text-muted">~₹18 / sq ft</td>
                  <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(area * 18) }}</td>
                </tr>
                <tr class="bg-elevated/40">
                  <td class="py-2.5 px-4 font-semibold" colspan="2">Complete gypsum cost</td>
                  <td class="py-2.5 px-4 text-right tabular-num font-bold text-highlighted">{{ fmt(area * 193) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <UAlert
            icon="i-ph-warning-circle"
            color="warning"
            variant="soft"
            class="mt-3"
            title="The classic surprise"
            description="People calculate only the board rate, start the work, then get surprised when electrical wiring inside the ceiling is billed separately."
          />
        </section>

        <!-- 3. Quality checklist -->
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-1 flex items-center gap-2">
            <UIcon name="i-ph-clipboard-text" class="size-5 text-primary" />3. Quality checklist
          </h2>
          <p class="text-sm text-muted mb-3">
            At ₹70–80/sq ft contractors easily agree — but always ask which brand of material he is using.
          </p>
          <ul class="space-y-2.5">
            <li class="flex gap-2.5 text-sm">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Boards</strong> — good quality only, otherwise they absorb dampness and get damaged. Trusted brands: <strong>Gyproc</strong> (Saint-Gobain), <strong>Armstrong</strong>, <strong>USG Boral</strong>, <strong>India Gypsum</strong>.</span>
            </li>
            <li class="flex gap-2.5 text-sm">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Channels</strong> — don't judge thick vs thin; just make sure the channels are from the same trusted brands.</span>
            </li>
            <li class="flex gap-2.5 text-sm">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Fasteners & screws</strong> — the entire ceiling hangs on these. Cheap ones are the silent killer. Trusted brands: <strong>Zebroc</strong> or <strong>Armstrong</strong>.</span>
            </li>
            <li class="flex gap-2.5 text-sm">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Joint filler + fiberglass tape</strong> — fills the gaps between boards and prevents cracks. Good material = crack-free ceiling for years.</span>
            </li>
          </ul>
          <UAlert
            icon="i-ph-magnifying-glass"
            color="info"
            variant="soft"
            class="mt-3"
            title="Where contractors actually save money"
            description="They use good boards and channels but quietly cut cost on fasteners and joint filler — cracks start appearing later. Watch those three items."
          />
        </section>
      </div>

      <footer class="mt-10 text-center text-xs text-muted">
        Cost breakdown from the
        <a
          href="https://www.youtube.com/watch?v=G_DU06719AI"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline"
        >gypsum false ceiling video</a>
        · Indicative rates, verify quotes in your city ·
        <NuxtLink to="/interiors" class="text-primary hover:underline">All interior guides</NuxtLink>
      </footer>
    </UContainer>
  </div>
</template>
