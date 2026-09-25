<script setup lang="ts">
import {
  DEFAULT_ITEMS,
  DEFAULT_RATES,
  POSSESSION_OPTIONS,
  RATE_CONFIGS,
  type LineItem,
  type PossessionStatus,
  type RateFieldId,
  type Rates,
} from '~/composables/useCalculatorConfig'
import { computeBreakdown, formatINR } from '~/composables/computeBreakdown'

const possessionStatus = ref<PossessionStatus>('underConstruction')

useHead({
  title: 'FlatBuy — All-inclusive cost calculator',
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
})

const rates = reactive<Rates>({ ...DEFAULT_RATES })
const items = ref<LineItem[]>(DEFAULT_ITEMS.map(i => ({ ...i, formula: { ...i.formula } })))

const result = computed(() => computeBreakdown(rates, items.value, possessionStatus.value))

const animatedTotal = ref(0)
let rafId = 0

watch(() => result.value.grandTotal, (target) => {
  if (import.meta.server) {
    animatedTotal.value = target
    return
  }
  cancelAnimationFrame(rafId)
  const from = animatedTotal.value
  if (from === target) return
  const duration = 500
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - p, 3)
    animatedTotal.value = Math.round(from + (target - from) * eased)
    if (p < 1) rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}, { immediate: true })

onMounted(() => {
  animatedTotal.value = result.value.grandTotal
})

const propertyInputs = RATE_CONFIGS.filter(c => c.group === 'property')
const ratesAndFeesInputs = RATE_CONFIGS.filter(c => c.group !== 'property')

const rateFieldGroups = [
  {
    key: 'taxes',
    label: 'Taxes & government fees',
    icon: 'i-ph-bank',
    fields: RATE_CONFIGS.filter(c => c.group === 'taxes'),
  },
  {
    key: 'handover',
    label: 'Handover charges',
    icon: 'i-ph-key',
    fields: RATE_CONFIGS.filter(c => c.group === 'handover'),
  },
]

const rateFieldsOpen = ref(false)
const collapsed = reactive<Record<string, boolean>>({
  property: false,
  taxes: true,
  handover: true,
})

const highlightedField = ref<string | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

const LINE_ITEM_FIELD: Record<string, { field: RateFieldId, collapsible?: boolean, group?: string }> = {
  'base-price': { field: 'basePricePerSqft' },
  'amenities': { field: 'amenitiesPerSqft' },
  'car-parking': { field: 'carParkingFixed' },
  'facing-premium': { field: 'facingPremiumPerSqft' },
  'floor-rise': { field: 'floorRisePerSqft' },
  'view-premium': { field: 'viewPremiumPerSqft' },
  'gst': { field: 'gstRate', collapsible: true, group: 'taxes' },
  'stamp-duty': { field: 'stampDutyRate', collapsible: true, group: 'taxes' },
  'transfer-duty': { field: 'transferDutyRate', collapsible: true, group: 'taxes' },
  'registration-fee': { field: 'registrationFeeRate', collapsible: true, group: 'taxes' },
  'legal-fee': { field: 'legalFeeFixed', collapsible: true, group: 'handover' },
  'gst-legal': { field: 'gstOnLegalRate', collapsible: true, group: 'handover' },
  'corpus-fund': { field: 'corpusFundPerSqft', collapsible: true, group: 'handover' },
  'maintenance': { field: 'maintenancePerSqft', collapsible: true, group: 'handover' },
  'gst-maintenance': { field: 'gstOnMaintenanceRate', collapsible: true, group: 'handover' },
}

async function editFieldFor(itemId: string) {
  const mapping = LINE_ITEM_FIELD[itemId]
  if (!mapping) return
  if (mapping.collapsible) {
    rateFieldsOpen.value = true
    collapsed[mapping.group!] = false
    await nextTick()
  }
  goToField(mapping.field)
}

function goToField(id: RateFieldId) {
  const el = document.getElementById(`field-${id}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  highlightedField.value = id
  clearTimeout(highlightTimer)
  highlightTimer = setTimeout(() => (highlightedField.value = null), 2500)
}

function resetDefaults() {
  Object.assign(rates, DEFAULT_RATES)
  items.value = DEFAULT_ITEMS.map(i => ({ ...i, formula: { ...i.formula } }))
}

function isPercentage(id: string) {
  return ['gstRate', 'stampDutyRate', 'transferDutyRate', 'registrationFeeRate', 'gstOnLegalRate', 'gstOnMaintenanceRate'].includes(id)
}

function shortUnit(suffix?: string) {
  if (!suffix) return ''
  if (suffix === '%') return '%'
  if (suffix.startsWith('₹')) return suffix === '₹' ? '₹' : '₹ / sq. ft.'
  return suffix
}

function formatRate(id: string) {
  const v = rates[id as keyof Rates] || 0
  return isPercentage(id) ? formatINR(v * 100, { compact: false }).replace('₹', '') + '%' : formatINR(v)
}

const grandTotalCompact = computed(() => {
  const t = result.value.grandTotal
  if (t >= 1e7) return `${(t / 1e7).toFixed(2)} crore`
  if (t >= 1e5) return `${(t / 1e5).toFixed(2)} lakh`
  return formatINR(t)
})

const propertyItems = computed(() => result.value.categories.find(c => c.key === 'property'))
const taxesItems = computed(() => result.value.categories.find(c => c.key === 'taxes'))
const handoverItems = computed(() => result.value.categories.find(c => c.key === 'handover'))

function toggleCategory(key: string) {
  collapsed[key] = !collapsed[key]
}
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-8 sm:py-10 max-w-4xl">
      <header class="mb-8">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-buildings" class="size-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy</span>
                <UBadge color="neutral" variant="subtle" size="sm">Calculator</UBadge>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-highlighted leading-tight">
                All-inclusive cost calculator
              </h1>
            </div>
          </div>
        </div>
        <p class="mt-2 text-muted">
          Every charge from booking to handover, in one total. The summary stays pinned while you edit.
        </p>
        <USeparator class="mt-6" />
      </header>

      <UColorModeSelect
        class="fixed top-4 right-4 z-50 w-32"
        color="neutral"
        size="sm"
      />

      <div class="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <!-- LEFT: inputs -->
        <div class="space-y-10">
          <!-- Flat configuration -->
          <section>
            <div class="flex items-center gap-2">
              <UIcon name="i-ph-buildings" class="size-5 text-muted" />
              <h2 class="text-xl font-bold">Flat configuration</h2>
            </div>
            <p class="mt-1 text-sm text-muted">
              These details are usually the same across flats in a project.
            </p>

            <UFormField label="Possession status" size="md" class="mt-5">
              <URadioGroup
                v-model="possessionStatus"
                :items="POSSESSION_OPTIONS"
                variant="card"
                orientation="horizontal"
                size="sm"
                :ui="{
                  fieldset: 'w-full gap-x-3',
                  item: 'flex-1 rounded-lg px-3 py-2.5',
                  wrapper: 'w-full',
                }"
              />
            </UFormField>

            <div class="mt-5 grid grid-cols-1 gap-y-5">
              <UFormField
                v-for="cfg in propertyInputs"
                :key="cfg.id"
                :label="cfg.label"
                :description="cfg.hint"
                :size="cfg.id === 'flatSize' || cfg.id === 'basePricePerSqft' ? 'xl' : 'md'"
              >
                <div
                  :id="`field-${cfg.id}`"
                  class="relative transition-all duration-500 rounded-(--ui-radius)"
                  :class="[
                    cfg.id === 'flatSize' || cfg.id === 'basePricePerSqft' ? 'max-w-md' : '',
                    highlightedField === cfg.id ? 'ring-2 ring-primary bg-primary/5' : '',
                  ]"
                >
                  <UInputNumber
                    v-model="rates[cfg.id]"
                    :min="0"
                    :step="1"
                    :increment="false"
                    :decrement="false"
                    disable-wheel-change
                    :formatOptions="{ maximumFractionDigits: 2 }"
                    :ui="cfg.id === 'flatSize' || cfg.id === 'basePricePerSqft'
                      ? { base: 'pr-24 text-lg/7 px-4 py-2.5 font-medium' }
                      : { base: 'pr-20' }"
                    class="w-full"
                  />
                  <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted whitespace-nowrap">
                    {{ shortUnit(cfg.suffix) }}
                  </span>
                </div>
              </UFormField>
            </div>

            <USeparator class="mt-10" />
          </section>

          <!-- Rates & fees -->
          <section>
            <div class="flex items-center gap-2">
              <UIcon name="i-ph-percent" class="size-5 text-muted" />
              <h2 class="text-xl font-bold">Rates &amp; fees</h2>
            </div>
            <p class="mt-1 text-sm text-muted">
              Statutory rates, usually unchanged. Expand to edit.
            </p>

            <UCollapsible v-model:open="rateFieldsOpen" class="mt-4">
              <div class="flex items-center justify-between py-3">
                <span class="font-semibold">Rates &amp; government fees</span>
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  :icon="rateFieldsOpen ? 'i-ph-caret-up' : 'i-ph-caret-down'"
                  aria-label="Toggle rates section"
                />
              </div>
              <template #content>
                <p class="text-sm text-muted mb-4">
                  Statutory rates and possession charges. Defaults match the project sheet; edit only if your quote differs.
                </p>

                <div class="space-y-6 pb-4">
                  <div
                    v-for="group in rateFieldGroups"
                    :key="group.key"
                    class="rounded-lg border border-default p-4"
                  >
                    <div class="flex items-center gap-2 mb-4">
                      <UIcon :name="group.icon" class="size-4 text-muted" />
                      <h4 class="text-sm font-semibold">{{ group.label }}</h4>
                    </div>
                    <div class="space-y-5">
                      <UFormField
                        v-for="cfg in group.fields"
                        :id="undefined"
                        :key="cfg.id"
                        :label="cfg.label"
                        :description="cfg.hint"
                        size="md"
                      >
                        <template v-if="cfg.id === 'maintenanceMonths'">
                          <div
                            :id="`field-maintenanceMonths`"
                            class="flex flex-wrap items-center gap-2 transition-all duration-500 rounded-(--ui-radius)"
                            :class="highlightedField === 'maintenanceMonths' ? 'ring-2 ring-primary bg-primary/5 p-2 -m-2' : ''"
                          >
                            <UButton
                              v-for="opt in [12, 24, 36, 48]"
                              :key="opt"
                              size="sm"
                              :variant="rates.maintenanceMonths === opt ? 'solid' : 'outline'"
                              color="neutral"
                              @click="rates.maintenanceMonths = opt"
                            >
                              {{ opt / 12 }} yr{{ opt === 12 ? '' : 's' }}
                            </UButton>
                            <UInputNumber
                              v-model="rates.maintenanceMonths"
                              :min="0"
                              :step="1"
                              :increment="false"
                              :decrement="false"
                              disable-wheel-change
                              :formatOptions="{ maximumFractionDigits: 0 }"
                              :ui="{ base: 'pr-20' }"
                              class="w-36"
                            />
                            <span class="text-xs text-muted whitespace-nowrap">months</span>
                          </div>
                        </template>
                        <div
                          v-else
                          :id="`field-${cfg.id}`"
                          class="relative transition-all duration-500 rounded-(--ui-radius)"
                          :class="highlightedField === cfg.id ? 'ring-2 ring-primary bg-primary/5' : ''"
                        >
                          <UInputNumber
                            v-model="rates[cfg.id]"
                            :min="0"
                            :step="isPercentage(cfg.id) ? 0.005 : 1"
                            :increment="false"
                            :decrement="false"
                            disable-wheel-change
                            :formatOptions="isPercentage(cfg.id)
                              ? { maximumFractionDigits: 3 }
                              : { maximumFractionDigits: 2 }"
                            :ui="{ base: 'pr-20' }"
                            class="w-full"
                          />
                          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted whitespace-nowrap">
                            {{ shortUnit(cfg.suffix) }}
                          </span>
                        </div>
                      </UFormField>
                    </div>
                  </div>
                </div>
              </template>
            </UCollapsible>
            <USeparator class="mt-2" />
          </section>
        </div>

        <!-- RIGHT: summary (sticky) -->
        <div class="lg:sticky lg:top-8 self-start">
          <UCard class="rounded-xl border-default">
            <div class="text-muted">Total flat cost</div>
            <div class="mt-1 text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
              {{ formatINR(animatedTotal) }}
            </div>
            <div class="mt-1 text-sm text-muted">
              All-inclusive · {{ grandTotalCompact }}
            </div>

            <USeparator class="my-5" />

            <div class="space-y-1">
              <details
                v-for="cat in result.categories"
                :key="cat.key"
                :open="!collapsed[cat.key]"
                class="group"
              >
                <summary
                  class="flex items-center justify-between cursor-pointer list-none py-2 rounded-md"
                  @click.prevent="toggleCategory(cat.key)"
                >
                  <span class="flex items-center gap-2 font-semibold">
                    <UIcon
                      :name="cat.key === 'property' ? 'i-ph-buildings' : cat.key === 'taxes' ? 'i-ph-bank' : 'i-ph-key'"
                      class="size-4 text-muted"
                    />
                    {{ cat.label }}
                  </span>
                  <span class="flex items-center gap-2 tabular-nums">
                    {{ formatINR(cat.subtotal) }}
                    <UIcon
                      :name="collapsed[cat.key] ? 'i-ph-caret-down' : 'i-ph-caret-up'"
                      class="size-4 text-muted transition-transform"
                    />
                  </span>
                </summary>

                <div class="pb-2 space-y-2.5">
                  <div
                    v-for="ci in cat.items"
                    :key="ci.item.id"
                    class="group/item grid grid-cols-[1fr_auto_auto] items-baseline gap-x-3 text-sm rounded-md cursor-pointer transition-colors hover:bg-elevated/60"
                    :title="`Edit ${ci.item.label} rate`"
                    @click="editFieldFor(ci.item.id)"
                  >
                    <div class="font-medium truncate underline decoration-transparent underline-offset-2 transition-colors group-hover/item:decoration-current">
                      {{ ci.item.label }}
                    </div>
                    <div class="text-xs text-muted tabular-nums whitespace-nowrap">{{ ci.calculation }}</div>
                    <div class="tabular-nums whitespace-nowrap text-right">{{ formatINR(ci.amount) }}</div>
                  </div>
                  <USeparator />
                  <div class="flex justify-between text-sm text-muted">
                    <span>{{ cat.key === 'property' ? 'Flat cost subtotal' : cat.key === 'taxes' ? 'Taxes subtotal' : 'Handover subtotal' }}</span>
                    <span class="tabular-nums">{{ formatINR(cat.subtotal) }}</span>
                  </div>
                </div>
              </details>
            </div>

            <USeparator class="my-5" />

            <div class="flex items-baseline justify-between gap-4">
              <div>
                <div class="text-xl font-bold">Grand total</div>
                <div class="text-xs text-muted mt-1">
                  Property + taxes + handover · adjusts with premiums
                </div>
              </div>
              <div class="text-2xl sm:text-3xl font-bold tabular-nums text-right">
                {{ formatINR(result.grandTotal) }}
              </div>
            </div>
          </UCard>

          <div class="mt-4 flex justify-end">
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              icon="i-ph-arrow-counter-clockwise"
              @click="resetDefaults"
            >
              Reset to defaults
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>