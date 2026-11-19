<script setup lang="ts">
useHead({
  title: 'FlatBuy — Carpenter Works Guide',
  meta: [
    { name: 'description', content: 'Plywood wardrobe cost guide 2025: labor and material rates, plywood grades (MR/BWR/BWP), laminate vs acrylic finishes, branded hardware, design planning and common mistakes.' },
  ],
})

const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

/* Worked example from rate ladder: 7 ft × 6 ft = 42 sq ft @ basic ₹900 */
const plywoodExample = computed(() => Math.round(42 * 900))
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
                Carpenter Works — Plywood Wardrobe Guide
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
          Building a plywood wardrobe? Everyone makes them — and unfortunately many people get fooled
          during the process. Rates, plywood grades, finishes, hardware, mistakes to avoid and worked
          cost examples.
        </p>
      </header>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-receipt" class="size-5 text-primary" />Current rates
          </h2>
          <div class="overflow-x-auto rounded-xl border border-default">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/40">
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Component</th>
                  <th class="text-right py-2.5 px-4 font-medium text-muted">Rate / sq ft</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Labor (laminate / mica finish)</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹300–350</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4">Labor (acrylic finish — needs precision fitting)</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹400–450</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-4">Material (depends on finish & quality)</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹600–1,000</td>
                </tr>
                <tr class="bg-elevated/40">
                  <td class="py-2.5 px-4" colspan="2">
                    Worked example — 7 ft × 6 ft = 42 sq ft at the basic rate (₹300 labor + ₹600 material = ₹900/sq ft)
                  </td>
                  <td class="py-2.5 px-4 text-right tabular-num font-bold text-highlighted">≈ {{ fmt(plywoodExample) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-stack" class="size-5 text-primary" />Plywood grades — the #1 mistake
          </h2>
          <div class="overflow-x-auto rounded-xl border border-default mb-3">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/40">
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Grade</th>
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Water resistance</th>
                  <th class="text-left py-2.5 px-4 font-medium text-muted">IS mark</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4 font-medium">MR (moisture resistant)</td>
                  <td class="py-2.5 px-4 text-muted">Resists humidity, not waterproof</td>
                  <td class="py-2.5 px-4 tabular-num">IS 303</td>
                </tr>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4 font-medium">BWR (boiling water resistant)</td>
                  <td class="py-2.5 px-4 text-muted">Better than MR, still not fully waterproof</td>
                  <td class="py-2.5 px-4 tabular-num">IS 303</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-4 font-medium">BWP (boiling waterproof / marine)</td>
                  <td class="py-2.5 px-4 text-muted">Fully waterproof — best for damp conditions and long-lasting wardrobes</td>
                  <td class="py-2.5 px-4 tabular-num">IS 710</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-warning-circle" class="size-5 text-warning shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Every contractor claims "best quality"</strong> — unless you know what to look for, you can end up with the wrong grade. For a long-lasting wardrobe, go for BWP.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-lightbulb" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Pro tip — high-quality ply body, MDF shutters.</strong> MDF is lighter, so it reduces stress on hinges and prevents sagging — plus it gives a very smooth finish when laminated or acrylic is applied.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Premium ply boards:</strong> ₹3,000–5,000 depending on brand (Durian and other reputed companies). Always choose branded boards to avoid hidden quality issues.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-sparkle" class="size-5 text-primary" />Shutter finish — laminate vs acrylic
          </h2>
          <div class="overflow-x-auto rounded-xl border border-default">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/40">
                  <th class="text-left py-2.5 px-4 font-medium text-muted">Finish</th>
                  <th class="text-left py-2.5 px-4 font-medium text-muted">What it is</th>
                  <th class="text-right py-2.5 px-4 font-medium text-muted">Cost / 8×4 sheet</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-default/50">
                  <td class="py-2.5 px-4 font-medium">Laminate</td>
                  <td class="py-2.5 px-4 text-muted">1–1.5 mm thick, decent gloss but more prone to scratches — the good alternative on a tighter budget</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹800–1,200</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-4 font-medium">Acrylic</td>
                  <td class="py-2.5 px-4 text-muted">High-gloss premium finish; a skilled task — not every carpenter can handle it, so labor rises to ₹400–450/sq ft</td>
                  <td class="py-2.5 px-4 text-right tabular-num">₹3,000–4,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-gear" class="size-5 text-primary" />Hardware — never compromise here
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Branded hinges:</strong> Hafele, Hettich and other reputed brands run ₹300–500. Hinges bear the most load from frequent opening and closing — low-quality ones wear out quickly.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-warning-circle" class="size-5 text-warning shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Skip local ₹150–200 hinges</strong> — you save a bit now but pay more later on replacements. Never compromise here.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Soft-close drawer channels:</strong> regular channels ~₹600/set vs soft-close ₹1,200–1,500 — a smooth, quiet closing motion that enhances usability and life.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-notebook" class="size-5 text-primary" />Plan the design — the most overlooked step
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Decide the layout before starting:</strong> how many hanging sections and their height, compartments for suits/coats, space for accessories, shoe racks, etc.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-warning-circle" class="size-5 text-warning shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">No plan = guesswork.</strong> Your carpenter will build on assumptions and you'll face issues later fitting clothes or organizing items.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Find reference designs online</strong> (Pinterest, Google Images) — take screenshots and share them with your carpenter so they build exactly what you need.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-lightning" class="size-5 text-primary" />Bottom line
          </h2>
          <div class="rounded-xl border border-default bg-elevated/40 p-4 text-sm">
            Consider <strong class="text-highlighted">₹1,000/sq ft (material + labor)</strong> as a fair base.
            High-end materials, finishes and branded hardware push the cost up accordingly — a
            <strong class="text-highlighted">10 ft × 10 ft wardrobe easily reaches ~₹1,00,000</strong> with good
            quality. Decide based on your style, budget and durability expectations.
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
