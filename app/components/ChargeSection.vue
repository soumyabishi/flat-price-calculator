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

const GOV_IDS = new Set(['stamp-duty', 'transfer-duty', 'registration-fee', 'tds'])

function isGov(item: ChargeItem) {
  return GOV_IDS.has(item.id)
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

            <!-- GST toggle -->
            <USwitch
              v-model="item.gstApplicable"
              size="xs"
              :disabled="isGov(item)"
            />
            <span class="text-xs text-muted">GST</span>

            <!-- GST rate (whole %) -->
            <UInputNumber
              v-if="item.gstApplicable"
              v-model="item.gstRate"
              :min="0"
              :max="28"
              :step="1"
              :increment="false"
              :decrement="false"
              disable-wheel-change
              :formatOptions="{ maximumFractionDigits: 1 }"
              size="sm"
              class="w-24"
            />
            <span v-if="item.gstApplicable" class="text-xs text-muted -ml-1">%</span>
          </div>

          <div class="flex items-center gap-2">
            <!-- value input -->
            <UInputNumber
              v-model="item.value"
              :min="0"
              :step="isGov(item) ? 0.5 : 100"
              :increment="false"
              :decrement="false"
              disable-wheel-change
              :formatOptions="isGov(item)
                ? { maximumFractionDigits: 1 }
                : { maximumFractionDigits: 2 }"
              size="sm"
              class="flex-1"
              :placeholder="isGov(item) ? 'Rate % (e.g. 4 = 4%)' : 'Amount'"
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