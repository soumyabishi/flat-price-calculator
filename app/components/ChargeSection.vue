<script setup lang="ts">
import type { ChargeItem, ChargeBasis, Project } from '~/composables/useProjectConfig'
import { formatPercent } from '~/composables/computeProject'

// mirrors the config default; kept here so the checkbox fallback stays local
const DEFAULT_GST_RATE = 0.05

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

const GST_RATE_OPTIONS = [
  { label: '5%', value: '5' },
  { label: '12%', value: '12' },
  { label: '18%', value: '18' },
  { label: 'Custom…', value: 'custom' },
]

function setGst(item: ChargeItem, on: boolean) {
  if (!on) {
    item.gstApplicable = false
    return
  }
  // turning GST on with no prior rate falls back to the standard 5%
  item.gstApplicable = true
  if (!(item.gstRate > 0)) item.gstRate = DEFAULT_GST_RATE
}

const GOV_IDS = new Set(['stamp-duty', 'transfer-duty', 'registration-fee', 'tds'])

function isGov(item: ChargeItem) {
  return GOV_IDS.has(item.id)
}

// bridge between gstApplicable/gstRate (fraction) and the single select; the
// custom flag overrides the derived value so a chosen "Custom…" sticks
function gstSelectOf(item: ChargeItem): string {
  if (!item.gstApplicable) return 'none'
  if (customGst.value?.[item.id]) return 'custom'
  const pctVal = item.gstRate * 100
  if ([5, 12, 18].includes(pctVal)) return String(pctVal)
  return 'custom'
}

function setGstSelect(item: ChargeItem, v: string) {
  if (v === 'none') {
    item.gstApplicable = false
    customGst.value[item.id] = false
    return
  }
  item.gstApplicable = true
  if (v !== 'custom') {
    item.gstRate = Number(v) / 100
    customGst.value[item.id] = false
    return
  }
  // "Custom" writes no number — a rate of 5/12/18 would snap the select back.
  // The choice has to live here, or the controlled select discards it.
  customGst.value[item.id] = true
}

/** "Custom…" chosen per item, kept as UI state: a bare gstRate number cannot
 * express it, since a 5/12/18 value would make the select show that instead. */
const customGst = ref<Record<string, boolean>>({})

/**
 * The unit lives inside the amount input — the way "floor" and "sq.ft." do on
 * the Flat tab — and doubles as the basis menu, so there is no separate basis
 * control to keep aligned. `pad` reserves room inside the input for the widest
 * text each basis can show.
 */
function unitOf(item: ChargeItem): { text: string, pad: string } {
  if (isGov(item)) return { text: '% of net flat cost', pad: 'pr-40' }
  switch (item.basis) {
    case 'perSqft': return { text: '₹ / sq.ft.', pad: 'pr-24' }
    case 'perFloor': return { text: '₹ / sq.ft. / floor', pad: 'pr-36' }
    case 'perUnit': return { text: '₹ / unit', pad: 'pr-24' }
    default: return { text: '₹', pad: 'pr-9' }
  }
}

/** Basis menu for the suffix button; the current basis shows a check. */
function basisMenu(item: ChargeItem) {
  return [BASIS_OPTIONS.map(o => ({
    label: o.label,
    value: o.value,
    onSelect: () => { item.basis = o.value },
  }))]
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
            class="flex-1"
            placeholder="Charge name"
          />
        </div>

        <div v-if="item.optional && !item.enabled" class="text-xs text-muted -mt-1">
          Toggle on to include this charge
        </div>

        <template v-else>
          <!-- One row: how many, and the amount. The basis is the suffix dropdown
               inside the amount input, so there is no separate basis control.
               On narrow cards the row wraps rather than shrinking the amount
               below usability. -->
          <div class="flex flex-wrap items-center gap-2">
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
              class="w-20"
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
              class="w-20"
            />

            <!-- amount; the suffix on the right is the basis dropdown itself -->
            <div class="relative flex-1 min-w-[9rem]">
              <UInputNumber
                v-model="item.value"
                :min="0"
                :step="isGov(item) ? 0.005 : 1"
                :increment="false"
                :decrement="false"
                disable-wheel-change
                :formatOptions="isGov(item)
                  ? { maximumFractionDigits: 3 }
                  : { maximumFractionDigits: 2 }"
                :placeholder="isGov(item) ? 'Rate (e.g. 0.04 = 4%)' : 'Amount'"
                :ui="{ base: `${unitOf(item).pad} px-3 py-2 font-medium` }"
                class="w-full"
              />
              <!-- The suffix is a ghost button opening the basis menu: it reads as
                   part of the input, but is an ordinary button, so no select
                   chrome has to be painted over. -->
              <UDropdownMenu
                v-if="!isGov(item)"
                :items="basisMenu(item)"
                :content="{ align: 'end' }"
                :ui="{ content: 'w-44' }"
              >
                <UButton
                  variant="link"
                  color="neutral"
                  size="xs"
                  trailing-icon="i-ph-caret-down"
                  class="absolute inset-y-0 right-0 h-full pe-2.5 ps-2 text-xs font-normal text-muted rounded-none"
                >
                  {{ unitOf(item).text }}
                </UButton>
                <template #item-trailing="{ item: o }">
                  <UIcon
                    v-if="item.basis === o.value"
                    name="i-ph-check"
                    class="size-3.5 shrink-0 text-muted"
                  />
                </template>
              </UDropdownMenu>
              <span v-else class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted whitespace-nowrap">{{ unitOf(item).text }}</span>
            </div>
          </div>

          <!-- GST as an add-on: a checkbox rather than a No-GST option in a
               select. Most charges here are small and GST-free, so the default
               state is off and the rate picker only exists once you ask for it.
               Government charges never carry GST, so they get no row at all. -->
          <div v-if="!isGov(item)" class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <UCheckbox
              :model-value="item.gstApplicable"
              label="Add GST"
              size="md"
              :ui="{ label: 'text-sm text-muted' }"
              @update:model-value="(v: boolean) => setGst(item, v)"
            />
            <template v-if="item.gstApplicable">
              <USelect
                :model-value="gstSelectOf(item)"
                class="w-32"
                size="md"
                :items="GST_RATE_OPTIONS"
                @update:model-value="(v: string) => setGstSelect(item, v)"
              />
              <UInputNumber
                v-if="gstSelectOf(item) === 'custom'"
                v-model="item.gstRate"
                :min="0"
                :max="0.5"
                :step="0.0001"
                :increment="false"
                :decrement="false"
                disable-wheel-change
                :formatOptions="{ maximumFractionDigits: 4 }"
                placeholder="Rate (e.g. 0.075 = 7.5%)"
                class="w-44"
              />
            </template>
          </div>

          <div v-if="item.hint" class="text-xs text-muted">
            {{ item.hint }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>