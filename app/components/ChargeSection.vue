<script setup lang="ts">
import type { ChargeItem, ChargeBasis, Project } from '~/composables/useProjectConfig'
import { formatPercent } from '~/composables/computeProject'

defineProps<{
  project: Project
  title: string
  icon: string
  items: ChargeItem[]
  collapsible?: boolean
}>()

const open = ref(false)

const BASIS_OPTIONS: { label: string, value: ChargeBasis }[] = [
  { label: '₹ / sq.ft.', value: 'perSqft' },
  { label: '₹ / sq.ft. / floor', value: 'perFloor' },
  { label: 'Flat ₹', value: 'flat' },
  { label: '₹ / unit × count', value: 'perUnit' },
]

const GST_OPTIONS = [
  { label: 'No GST', value: 'none' },
  { label: '5%', value: '5' },
  { label: '12%', value: '12' },
  { label: '18%', value: '18' },
  { label: 'Custom…', value: 'custom' },
]

const GOV_IDS = new Set(['stamp-duty', 'transfer-duty', 'registration-fee', 'tds'])

function isGov(item: ChargeItem) {
  return GOV_IDS.has(item.id)
}

// bridge between gstApplicable/gstRate (fraction) and the single select
function gstSelectOf(item: ChargeItem): string {
  if (!item.gstApplicable) return 'none'
  const pctVal = item.gstRate * 100
  if ([5, 12, 18].includes(pctVal)) return String(pctVal)
  return 'custom'
}

function setGstSelect(item: ChargeItem, v: string) {
  if (v === 'none') {
    item.gstApplicable = false
    return
  }
  item.gstApplicable = true
  if (v !== 'custom') item.gstRate = Number(v) / 100
}
</script>

<template>
  <div class="rounded-lg border border-default p-4">
    <div class="flex items-center gap-2 mb-4">
      <UIcon :name="icon" class="size-4 text-muted" />
      <h4 class="text-sm font-semibold flex-1">{{ title }}</h4>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="rounded-lg border border-muted p-3 space-y-2"
        :class="item.optional && !item.enabled ? 'opacity-60' : ''"
      >
        <div class="flex items-center gap-2">
          <!-- enable toggle for optional items -->
          <USwitch
            v-if="item.optional"
            v-model="item.enabled"
            size="xs"
          />
          <UInput
            v-model="item.label"
            size="sm"
            class="flex-1"
            placeholder="Charge name"
          />
        </div>

        <div v-if="item.optional && !item.enabled" class="text-xs text-muted -mt-1">
          Toggle on to include this charge
        </div>

        <template v-else>
          <div class="flex flex-wrap items-center gap-2">
            <!-- basis selector -->
            <USelect
              v-model="item.basis"
              size="sm"
              class="w-40"
              :items="BASIS_OPTIONS"
              :disabled="isGov(item)"
            />

            <!-- perFloor: floors count -->
            <UInputNumber
              v-if="item.basis === 'perFloor'"
              v-model="item.floors"
              :min="0"
              :step="1"
              :increment="false"
              :decrement="false"
              disable-wheel-change
              :formatOptions="{ maximumFractionDigits: 0 }"
              placeholder="Floors"
              size="sm"
              class="w-28"
            />

            <!-- perUnit: units count -->
            <UInputNumber
              v-if="item.basis === 'perUnit'"
              v-model="item.units"
              :min="0"
              :step="1"
              :increment="false"
              :decrement="false"
              disable-wheel-change
              :formatOptions="{ maximumFractionDigits: 0 }"
              placeholder="Units"
              size="sm"
              class="w-28"
            />

            <!-- GST: single select (None / 5% / 12% / 18% / custom) -->
            <USelect
              :model-value="gstSelectOf(item)"
              size="sm"
              class="w-32"
              :items="GST_OPTIONS"
              :disabled="isGov(item)"
              @update:model-value="(v: string) => setGstSelect(item, v)"
            />
            <UInputNumber
              v-if="gstSelectOf(item) === 'custom'"
              v-model="item.gstRate"
              :min="0"
              :max="0.5"
              :step="0.005"
              :increment="false"
              :decrement="false"
              disable-wheel-change
              :formatOptions="{ maximumFractionDigits: 1 }"
              placeholder="Rate"
              size="sm"
              class="w-24"
            />
          </div>

          <div class="flex items-center gap-2">
            <!-- value input -->
            <UInputNumber
              v-model="item.value"
              :min="0"
              :step="isGov(item) ? 0.005 : 100"
              :increment="false"
              :decrement="false"
              disable-wheel-change
              :formatOptions="isGov(item)
                ? { maximumFractionDigits: 3 }
                : { maximumFractionDigits: 2 }"
              size="sm"
              class="flex-1"
              :placeholder="isGov(item) ? 'Rate (e.g. 0.04 = 4%)' : 'Amount'"
            />
            <span v-if="isGov(item)" class="text-xs text-muted whitespace-nowrap">% of net flat cost</span>
            <span v-else-if="item.basis === 'perSqft'" class="text-xs text-muted whitespace-nowrap">₹ / sq.ft.</span>
            <span v-else-if="item.basis === 'perFloor'" class="text-xs text-muted whitespace-nowrap">₹ / sq.ft. / floor</span>
            <span v-else-if="item.basis === 'perUnit'" class="text-xs text-muted whitespace-nowrap">₹ / unit</span>
            <span v-else class="text-xs text-muted whitespace-nowrap">₹</span>
          </div>

          <div v-if="item.hint" class="text-xs text-muted">
            {{ item.hint }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>