<script setup lang="ts">
useHead({
  title: 'FlatBuy — Carpenter Works Guide',
  meta: [
    { name: 'description', content: 'Plywood wardrobe cost guide 2025: labor and material rates, plywood grades (MR/BWR/BWP), shutter design mistakes — material, measurements, colors, handles — laminate vs acrylic finishes and branded hardware.' },
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
          <ul class="mt-3 space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-lightbulb" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Laminate thickness:</strong> inside of the shutter — 8 mm is fine, but always use more than 1 mm on the outer side.</span>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-ph-lightbulb" class="size-5 text-primary shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Loft shutters:</strong> avoid darker colors — they get highlighted too much.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-gear" class="size-5 text-primary" />Hardware — never compromise here
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
              <span><strong class="text-highlighted">BWP ply or HDHMR carcass — but blockboard shutters.</strong> Shutters are a moving part (opened and closed every day); 7–8 ft plywood shutters bend over time, blockboard won't. For grooves or embossed designs, add MDF over the blockboard.</span>
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
            <UIcon name="i-ph-door" class="size-5 text-primary" />Shutter design — 5 mistakes that make an expensive wardrobe look cheap
          </h2>
          <p class="text-sm text-muted mb-4">
            90% of a wardrobe's visible part is its shutters. Best plywood, branded hardware and premium
            finishes still won't look luxurious if these five mistakes creep in.
          </p>

          <div class="space-y-6">
            <div>
              <h3 class="font-semibold text-highlighted mb-2 text-sm uppercase tracking-wide">1 · Shutter material</h3>
              <ul class="space-y-2.5 text-sm">
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-warning-circle" class="size-5 text-warning shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Don't make shutters in the same material as the carcass.</strong> Shutters are a moving part — opened and closed every day.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Shutters always in blockboard:</strong> 7–8 ft plywood shutters bend over time; blockboard doesn't. Grooves or embossed designs? Add MDF on top of the blockboard to achieve that look.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-warning-circle" class="size-5 text-warning shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Never particle board</strong> — that's what cheap online furniture is made of.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-highlighted mb-2 text-sm uppercase tracking-wide">2 · Measurements</h3>
              <ul class="space-y-2.5 text-sm">
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-ruler" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Max shutter height 8 ft.</strong> All materials — ply to laminate — come in 8 ft standard size; above that, joints appear that don't look good.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Floor-to-ceiling wardrobe?</strong> Add 8 ft (or lintel-level) shutters with a loft on top — or drawers at the bottom with 8 ft shutters above them.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Draw straighteners behind 7–8 ft shutters.</strong> Long shutters risk bending in the long run — this small thing doubles the shutter's life.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-ruler" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Width — openable shutters max 2 ft</strong> (beyond that they get heavy and load the hinges). Best proportion: <strong class="text-highlighted">18–22 inches</strong>.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-highlighted mb-2 text-sm uppercase tracking-wide">3 · Wrong color & design</h3>
              <ul class="space-y-2.5 text-sm">
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-palette" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Small room → light colors, minimal design.</strong> A dark full-height wardrobe makes a small bedroom look even smaller.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-warning-circle" class="size-5 text-warning shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Don't over-design the shutters.</strong> 3–4 groove types + 2 colors + glass + patterns all together looks like a sweet shop, not a showroom.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Pick one design language:</strong> clean minimal shutters with handles · plain shutters with creative handles · molding with PU finish · frosted glass with aluminum profile. One theme across the whole wardrobe.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-highlighted mb-2 text-sm uppercase tracking-wide">4 · Handles — the most underrated decision</h3>
              <div class="overflow-x-auto rounded-xl border border-default">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-default bg-elevated/40">
                      <th class="text-left py-2.5 px-4 font-medium text-muted">Type</th>
                      <th class="text-left py-2.5 px-4 font-medium text-muted">What to know</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-default/50">
                      <td class="py-2.5 px-4 font-medium">Regular handles</td>
                      <td class="py-2.5 px-4 text-muted">Most affordable — but pick slim-profile modern handles, not old chunky ones</td>
                    </tr>
                    <tr class="border-b border-default/50">
                      <td class="py-2.5 px-4 font-medium">Profile / G-profile handles</td>
                      <td class="py-2.5 px-4 text-muted">Integrate into the shutter edge — best for a clean look</td>
                    </tr>
                    <tr>
                      <td class="py-2.5 px-4 font-medium">Push-to-open</td>
                      <td class="py-2.5 px-4 text-muted">No handles at all — looks most premium, but the mechanism quality must be good or it fails within 2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-highlighted mb-2 text-sm uppercase tracking-wide">5 · Room coordination</h3>
              <ul class="space-y-2.5 text-sm">
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-arrows-horizontal" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Keep at least 3 ft between the bed and wardrobe</strong> for openable shutters. If not possible, take sliding shutters — they work in as little as 2.5 ft.</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Low natural light?</strong> Use tinted, fluted or lacquered glass shutters — the reflection makes the room look bigger and brighter (tinted black, bronze, fluted, lacquered — used in many projects and it looks amazing).</span>
                </li>
                <li class="flex gap-2.5">
                  <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Coordinate colors with the wall and bed.</strong> The wardrobe is not a separate entity — it's the biggest furniture piece in the room.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
            <UIcon name="i-ph-gear" class="size-5 text-primary" />Hardware — never compromise here
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2.5">
              <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
              <span><strong class="text-highlighted">Branded hinges and channels:</strong> Hafele, Hettich, Ebco, Sleek, Ozone — shutters are used every day and cheap hardware fails first. Branded ones run ₹300–500; low-quality ones wear out quickly.</span>
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
