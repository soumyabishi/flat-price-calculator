<script setup lang="ts">
useHead({
  title: 'FlatBuy — Gypsum False Ceiling Guide',
  meta: [
    { name: 'description', content: 'Gypsum false ceiling: cost breakdown for any room size, material brand checklist, framing-time checklist, height & lighting rules — all from contractor-verified explainers.' },
  ],
})

const roomLength = ref(10)
const roomWidth = ref(10)

const area = computed(() => Math.max(1, Math.round((roomLength.value || 0) * (roomWidth.value || 0))))
const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

const sections = [
  { value: 'quality', label: 'Quality & brand checklist', icon: 'i-ph-clipboard-text' },
  { value: 'checklist', label: 'Framing-time checklist', icon: 'i-ph-list-checks' },
  { value: 'height', label: 'Height & lighting planning', icon: 'i-ph-arrows-down-up' },
  { value: 'tips', label: 'Design pro-tips', icon: 'i-ph-lightbulb' },
]
const openSection = ref()
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-4xl px-4 sm:px-6">
      <header class="mb-6">
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
          Estimate your cost below, then open the checklist sections before you sign anything — sources linked at the end.
        </p>
        <USeparator class="mt-5" />
      </header>

      <!-- 1. Cost (always visible) -->
      <div class="rounded-xl border border-default p-4 sm:p-5 mb-5">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-ph-ruler" class="size-5 text-primary" />
          <h2 class="font-semibold text-highlighted">Your cost</h2>
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

      <div class="overflow-x-auto rounded-xl border border-default mb-5">
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
              <td class="py-2.5 px-4">Boards + metal channels + labor</td>
              <td class="py-2.5 px-4 text-muted">₹70–80 / sq ft</td>
              <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(area * 80) }}</td>
            </tr>
            <tr class="border-b border-default/50">
              <td class="py-2.5 px-4">Electrical — wiring inside the ceiling: conduit pipes, quality wires (Polycab / HLS), concealed lights + LED strips</td>
              <td class="py-2.5 px-4 text-muted">₹95–100 / sq ft</td>
              <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(area * 95) }}</td>
            </tr>
            <tr class="border-b border-default/50">
              <td class="py-2.5 px-4">Painting — 1 primer + 1 paint coat</td>
              <td class="py-2.5 px-4 text-muted">~₹18 / sq ft</td>
              <td class="py-2.5 px-4 text-right tabular-num">{{ fmt(area * 18) }}</td>
            </tr>
            <tr class="bg-elevated/40">
              <td class="py-2.5 px-4 font-semibold" colspan="2">Complete cost</td>
              <td class="py-2.5 px-4 text-right tabular-num font-bold text-highlighted">{{ fmt(area * 193) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <UAlert
        icon="i-ph-warning-circle"
        color="warning"
        variant="soft"
        class="mb-6"
        title="The classic surprise"
        description="Contractors quote only the board rate. Electrical wiring inside the ceiling is always billed separately — budget for all three lines above."
      />

      <!-- Worked example from the video -->
      <h2 class="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
        Worked example from the video — 10×10 room, 12 electrical points
      </h2>
      <div class="grid sm:grid-cols-2 gap-4 mb-6">
        <div class="rounded-xl border border-default p-4">
          <h3 class="font-semibold text-highlighted mb-2">Electrical work</h3>
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-default/50">
                <td class="py-1.5">Labour</td>
                <td class="py-1.5 text-right text-muted">12 × ₹90</td>
                <td class="py-1.5 text-right tabular-num">₹1,080</td>
              </tr>
              <tr class="border-b border-default/50">
                <td class="py-1.5">Wiring & piping</td>
                <td class="py-1.5 text-right text-muted">12 × ₹340</td>
                <td class="py-1.5 text-right tabular-num">₹4,080</td>
              </tr>
              <tr class="border-b border-default/50">
                <td class="py-1.5">LED lights</td>
                <td class="py-1.5 text-right text-muted">12 × ₹220</td>
                <td class="py-1.5 text-right tabular-num">₹2,640</td>
              </tr>
              <tr class="border-b border-default/50">
                <td class="py-1.5">LED strip</td>
                <td class="py-1.5 text-right text-muted">10 m × ₹100</td>
                <td class="py-1.5 text-right tabular-num">₹1,000</td>
              </tr>
              <tr>
                <td class="py-1.5 font-semibold" colspan="2">Total electrical</td>
                <td class="py-1.5 text-right tabular-num font-bold text-highlighted">₹8,800</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rounded-xl border border-default p-4">
          <h3 class="font-semibold text-highlighted mb-2">Putty & primer</h3>
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-default/50">
                <td class="py-1.5">Primer (1 L covers ~200 sq ft)</td>
                <td class="py-1.5 text-right text-muted">1 L × ₹250</td>
                <td class="py-1.5 text-right tabular-num">₹250</td>
              </tr>
              <tr class="border-b border-default/50">
                <td class="py-1.5">Putty material (1 kg covers 14–16 sq ft)</td>
                <td class="py-1.5 text-right text-muted">13 kg × ₹55</td>
                <td class="py-1.5 text-right tabular-num">₹715</td>
              </tr>
              <tr class="border-b border-default/50">
                <td class="py-1.5">Putty labour</td>
                <td class="py-1.5 text-right text-muted">₹4/sq ft</td>
                <td class="py-1.5 text-right tabular-num">₹716</td>
              </tr>
              <tr>
                <td class="py-1.5 font-semibold" colspan="2">Total painting</td>
                <td class="py-1.5 text-right tabular-num font-bold text-highlighted">₹1,431</td>
              </tr>
            </tbody>
          </table>
          <p class="mt-2 text-xs text-dimmed">
            Putty quantities follow the video's example area (179 sq ft incl. design border); scale by your
            actual billable area.
          </p>
        </div>
      </div>

      <!-- 2. The rest — one-at-a-time accordions -->
      <h2 class="text-sm font-semibold text-muted uppercase tracking-wide mb-2">Before you sign anything</h2>
      <UAccordion
        v-model="openSection"
        type="single"
        collapsible
        :items="sections"
      >
        <template #leading="{ item }">
          <UIcon :name="item.icon" class="size-4 text-primary shrink-0" />
        </template>
        <template #body="{ item }">
          <!-- Quality -->
          <div v-if="item.value === 'quality'" class="space-y-2.5">
            <p class="text-sm text-muted">
              What a gypsum ceiling is: readymade boards (12.5 mm thick; 6×4, 8×4 or 10×4 ft) fixed on metal
              channel framing below the slab — almost any design, simple or modern. At ₹70–80/sq ft
              contractors easily agree, but always ask which brand of material he is using.
            </p>
            <ul class="space-y-2">
              <li class="flex gap-2.5 text-sm">
                <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                <span><strong class="text-highlighted">Boards</strong> — good quality only, otherwise they absorb dampness. Trusted brands: <strong>Gyproc</strong> (Saint-Gobain), <strong>Armstrong</strong>, <strong>USG Boral</strong>, <strong>India Gypsum</strong>.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                <span><strong class="text-highlighted">Channels</strong> — <strong>GI (galvanized iron), never local iron</strong>: local iron rusts within two years, GI doesn't. Brands: <strong>Gyproc</strong>, <strong>Armstrong</strong>, <strong>Jindal</strong>.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                <span><strong class="text-highlighted">Channel spacing</strong> — main channels every 2–3 ft, angle channels every 1.5–2 ft. More spacing = mid-span sag.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                <span><strong class="text-highlighted">Board thickness</strong> — minimum 12.5 mm; thinner boards bend easily.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                <span><strong class="text-highlighted">Fasteners & screws</strong> — the ceiling hangs on these. Trusted brands: <strong>Zebroc</strong> or <strong>Armstrong</strong>.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                <span><strong class="text-highlighted">Joint filler + fiberglass tape</strong> — prevents cracks between boards for years.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UIcon name="i-ph-check-circle" class="size-5 text-success shrink-0 mt-0.5" />
                <span><strong class="text-highlighted">Wet areas need different material</strong> — never plain board in bathrooms/balconies. Use MR-grade gypsum or PVC soft panels (fully waterproof).</span>
              </li>
            </ul>
            <UAlert
              icon="i-ph-magnifying-glass"
              color="info"
              variant="soft"
              title="Where contractors actually save money"
              description="Good boards and channels, cheap fasteners and joint filler — cracks start later. Watch those three items."
            />
            <UAlert
              icon="i-ph-warning-circle"
              color="error"
              variant="soft"
              title="Never fix the ceiling directly to the slab"
              description="Cheap work lowers only the design portion and puts putty on the rest — dampness and cracks start showing later. Boards must always sit on proper channel framing below the slab."
            />
          </div>

          <!-- Framing checklist -->
          <div v-else-if="item.value === 'checklist'" class="space-y-4">
            <div>
              <h3 class="font-semibold text-highlighted text-sm uppercase tracking-wide mb-2">Electrical</h3>
              <ul class="space-y-2">
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-fan" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Fan rod</strong> — install before the ceiling closes, at least 1.5–2 ft long, or the fan wobbles.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-bell" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Video doorbell wiring</strong> — decide today even if you install years later; an open wire on a finished wall ruins the look.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-wifi-high" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Wi-Fi cable</strong> — call your operator (Airtel / Jio) *before* the ceiling, not the contractor. Set the point where range is best.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-security-camera" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">CCTV</strong> — one cable per camera to the DVR box; plan routes and which screen you'll view them on.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-lightbulb" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Light samples at framing</strong> — hand your actual lights to the contractor, or frames land exactly where light cuts go and symmetry is ruined.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-magnet" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Magnetic track lights</strong> — need a special frame built at framing time; impossible to add later.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-swap" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Profile light grooves</strong> — cut against your actual sample, or the profile sits loose with visible gaps.</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-highlighted text-sm uppercase tracking-wide mb-2">Ventilation, services & safety</h3>
              <ul class="space-y-2">
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-fire" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Chimney pipe route</strong> — a beam near the window can force a re-route through finished work. Install the pipe at framing time.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-wind" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Bathroom exhaust point</strong> — don't forget the exhale point before packing the ceiling.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-door-open" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Geyser trap door</strong> — insist on a 2×2 ft trap door behind a concealed geyser, or maintenance breaks the ceiling.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-flame" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Sprinklers & smoke detectors</strong> — check locations before designing; shifting later adds ₹5,000–6,000+.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-snowflake" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">AC copper piping (VRV)</strong> — plan the route before finalizing the design.</span>
                </li>
                <li class="flex gap-2.5 text-sm">
                  <UIcon name="i-ph-speaker-high" class="size-5 text-primary shrink-0 mt-0.5" />
                  <span><strong class="text-highlighted">Insulation</strong> — rock wool (better) for sound; EPS sheet on top floors cuts room heat ~4°C and the power bill.</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-highlighted text-sm uppercase tracking-wide mb-2">Material checks with the contractor</h3>
              <div class="overflow-x-auto rounded-xl border border-default">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-default bg-elevated/40">
                      <th class="text-left py-2 px-4 font-medium text-muted">Ask for</th>
                      <th class="text-left py-2 px-4 font-medium text-muted">The standard</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-default/50">
                      <td class="py-2 px-4">Channel bundle weight</td>
                      <td class="py-2 px-4">Insist on the <strong>22 kg bundle</strong> — light frames (16/14 kg) bend and sag</td>
                    </tr>
                    <tr class="border-b border-default/50">
                      <td class="py-2 px-4">Channel type & spacing</td>
                      <td class="py-2 px-4">GI channels; main every 2–3 ft, angle/L-angle every 1.5–2 ft</td>
                    </tr>
                    <tr class="border-b border-default/50">
                      <td class="py-2 px-4">Fastener size</td>
                      <td class="py-2 px-4">8–10 mm</td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4">Screws</td>
                      <td class="py-2 px-4">Gyproc brand for gypsum board work</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <UAlert
              icon="i-ph-warning-circle"
              color="warning"
              variant="soft"
              title="Finalize all points before starting"
              description="Freeze the electrical layout, AC ducting and chandelier positions first, then a walkthrough with electrician + ceiling contractor. One missed point = break + rebuild = double labour & material."
            />
            <UAlert
              icon="i-ph-warning-circle"
              color="error"
              variant="soft"
              title="The ₹200 rule"
              description="A ₹200 forgotten part can force holes and breakage across the whole ceiling. Run this list room by room before the boards close."
            />
          </div>

          <!-- Height & lighting -->
          <div v-else-if="item.value === 'height'" class="grid sm:grid-cols-2 gap-4">
            <div class="rounded-xl border border-default p-4">
              <div class="flex items-center gap-2 mb-2">
                <UIcon name="i-ph-arrows-vertical" class="size-5 text-primary" />
                <h3 class="font-semibold text-highlighted">Height rules</h3>
              </div>
              <ul class="space-y-2 text-sm text-muted">
                <li>Keep clear height after the ceiling <strong class="text-highlighted">9 ft or more</strong>.</li>
                <li>Lights alone only need a <strong class="text-highlighted">4–7 inch</strong> gap.</li>
                <li>Cassette AC: <strong class="text-highlighted">9–10 in</strong> one-way, <strong class="text-highlighted">14 in</strong> four-way — keep the rest of the room at full height.</li>
                <li>Already ~9 ft? Do the ceiling <strong class="text-highlighted">only on the periphery</strong> — the fan hangs ~1 ft below the ceiling, and at 8 ft clear height a tall person feels it falling on their head.</li>
              </ul>
            </div>
            <div class="rounded-xl border border-default p-4">
              <div class="flex items-center gap-2 mb-2">
                <UIcon name="i-ph-lightbulb" class="size-5 text-primary" />
                <h3 class="font-semibold text-highlighted">Lighting rules</h3>
              </div>
              <ul class="space-y-2 text-sm text-muted">
                <li>COB every foot = a bright box: more heat, higher bill. <strong class="text-highlighted">Panel + COB need 5–7 ft spacing</strong>.</li>
                <li>Layer the colour temperature: <strong class="text-highlighted">4000–6000 K</strong> for area lighting, <strong class="text-highlighted">3000 K warm white</strong> for mood & task lights.</li>
              </ul>
            </div>
            <div class="sm:col-span-2">
              <UAlert
                icon="i-ph-lightbulb"
                color="primary"
                variant="soft"
                title="Keep the design simple"
                description="Don't clutter the ceiling with elements — it feels new for four days and bores you later. Simple, minimal designs stay timeless."
              />
            </div>
          </div>

          <!-- Pro tips -->
          <div v-else class="space-y-3">
            <ul class="space-y-3">
              <li class="flex gap-2.5 text-sm">
                <UBadge color="primary" variant="soft" class="shrink-0 mt-0.5">1</UBadge>
                <span><strong class="text-highlighted">Reverse cove = the best design.</strong> Leave a minimum 8-inch gap from the wall — the curtain pocket needs it so both layers can slide past each other.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UBadge color="primary" variant="soft" class="shrink-0 mt-0.5">2</UBadge>
                <span><strong class="text-highlighted">Wardrobe vs ceiling clash.</strong> Check wardrobe shutters open freely under the drop — otherwise you lose storage height or break/raise the ceiling.</span>
              </li>
              <li class="flex gap-2.5 text-sm">
                <UBadge color="primary" variant="soft" class="shrink-0 mt-0.5">3</UBadge>
                <span><strong class="text-highlighted">No light under the fan sweep.</strong> Designer fans run 4–5 ft wide — lights inside that swing flicker when the fan runs.</span>
              </li>
            </ul>
          </div>
        </template>
      </UAccordion>

      <footer class="mt-10 text-center text-xs text-muted">
        Sources:
        <a
          href="https://www.youtube.com/watch?v=G_DU06719AI"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline"
        >gypsum cost explainer</a>
        ·
        <a
          href="https://www.youtube.com/watch?v=_S7klUYMYnE"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline"
        >Ultimate False Ceiling Checklist (Interior Coach)</a>
        ·
        <a
          href="https://www.youtube.com/watch?v=aY-CIlCG-is"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline"
        >5 false ceiling mistakes</a>
        · Indicative rates, verify quotes in your city ·
        <NuxtLink to="/interiors" class="text-primary hover:underline">All interior guides</NuxtLink>
      </footer>
    </UContainer>
  </div>
</template>
