<script setup lang="ts">
import {
  DEFAULT_ITEMS,
  DEFAULT_RATES,
  RATE_CONFIGS,
  type LineItem,
  type Rates,
} from '~/composables/useCalculatorConfig'
import { computeBreakdown, formatINR } from '~/composables/computeBreakdown'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const rates = reactive<Rates>({ ...DEFAULT_RATES })
const items = ref<LineItem[]>(DEFAULT_ITEMS.map(i => ({ ...i, formula: { ...i.formula } })))

const result = computed(() => computeBreakdown(rates, items.value))

const propertyInputs = RATE_CONFIGS.filter(c => c.group === 'property')
const ratesAndFeesInputs = RATE_CONFIGS.filter(c => c.group !== 'property')

const rateFieldsOpen = ref(false)
const collapsed = reactive<Record<string, boolean>>({
  property: false,
  taxes: true,
  handover: true,
})

function resetDefaults() {
  Object.assign(rates, DEFAULT_RATES)
  items.value = DEFAULT_ITEMS.map(i => ({ ...i, formula: { ...i.formula } }))
}

function isPercentage(id: string) {
  return ['gstRate', 'stampDutyRate', 'transferDutyRate', 'registrationFeeRate', 'gstOnLegalRate', 'gstOnMaintenanceRate'].includes(id)
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
    <UContainer class="py-8 sm:py-10 max-w-6xl">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-highlighted">
          All-inclusive cost calculator
        </h1>
        <p class="mt-2 text-muted">
          Every charge from booking to handover, in one total. The summary stays pinned while you edit.
        </p>
        <USeparator class="mt-6" />
      </header>

      <UButton
        class="fixed top-4 right-4 z-50"
        variant="ghost"
        color="neutral"
        size="sm"
        :icon="isDark ? 'i-ph-sun' : 'i-ph-moon'"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      />

      <div class="grid gap-10 lg:grid-cols-2">
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

            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <UFormField
                v-for="cfg in propertyInputs"
                :key="cfg.id"
                :label="cfg.label"
                :description="cfg.hint"
                size="md"
              >
                <UInputNumber
                  v-model="rates[cfg.id]"
                  :min="0"
                  :step="1"
                  :formatOptions="{ maximumFractionDigits: 2 }"
                  :suffix="cfg.suffix && !cfg.suffix.startsWith('₹') ? ` ${cfg.suffix}` : ''"
                  class="w-full"
                />
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
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pb-4">
                  <UFormField
                    v-for="cfg in ratesAndFeesInputs"
                    :key="cfg.id"
                    :label="cfg.label"
                    :description="cfg.hint"
                    size="md"
                  >
                    <UInputNumber
                      v-model="rates[cfg.id]"
                      :min="0"
                      :step="isPercentage(cfg.id) ? 0.005 : 1"
                      :formatOptions="isPercentage(cfg.id)
                        ? { maximumFractionDigits: 3 }
                        : { maximumFractionDigits: 2 }"
                      class="w-full"
                    />
                  </UFormField>
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
              {{ formatINR(result.grandTotal) }}
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

                <div class="pl-6 pr-1 pb-2 space-y-3">
                  <div v-for="ci in cat.items" :key="ci.item.id" class="flex justify-between gap-4 text-sm">
                    <div>
                      <div class="font-medium">{{ ci.item.label }}</div>
                      <div class="text-xs text-muted">{{ ci.rateDetail }}</div>
                    </div>
                    <div class="tabular-nums whitespace-nowrap">
                      {{ formatINR(ci.amount) }}
                    </div>
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