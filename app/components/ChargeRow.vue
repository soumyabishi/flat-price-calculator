<script setup lang="ts">
import type { ChargeItem, Project } from '~/composables/useProjectConfig'
import { formatINR, formatPercent, type ComputedItem } from '~/composables/computeProject'

const props = defineProps<{
  item: ComputedItem
  project: Project
}>()

const emit = defineEmits<{
  edit: [itemId: string]
}>()

const isGov = props.item.item.section === 'government'
const isTds = props.item.item.id === 'tds'
const hasGst = props.item.gst > 0
const calc = computed(() => props.item.calculation)
</script>

<template>
  <div>
    <UTooltip
      :delay-duration="0"
      :content="{ side: 'left', align: 'center', sideOffset: 6 }"
    >
      <div
        class="group/item flex items-baseline justify-between gap-4 text-sm rounded-md cursor-pointer transition-colors hover:bg-elevated/60 py-0.5"
        :class="isTds ? 'text-muted' : ''"
        @click="emit('edit', item.item.id)"
      >
        <div class="min-w-0">
          <span class="font-medium underline decoration-transparent underline-offset-2 transition-colors group-hover/item:decoration-current" :class="isTds ? '' : ''">{{ item.item.label }}</span>
          <span v-if="calc && calc !== '—' && !calc.startsWith('No')" class="text-xs text-muted tabular-nums"> ({{ calc }})</span>
        </div>
        <div class="tabular-nums whitespace-nowrap text-right" :class="isTds ? 'text-muted' : 'font-medium'">
          {{ formatINR(item.amount) }}
        </div>
      </div>
      <template #content>
        <span class="flex items-center gap-1.5">
          <UIcon name="i-ph-pencil-simple-line" class="size-3.5" />
          Edit
        </span>
      </template>
    </UTooltip>

    <!-- GST arrow sub-row -->
    <div
      v-if="hasGst"
      class="group/item flex items-center justify-between gap-4 text-sm rounded-md cursor-pointer transition-colors hover:bg-elevated/60 ps-5 py-0.5"
      @click="emit('edit', item.item.id)"
    >
      <div class="min-w-0 text-muted">
        <span class="mr-1">↳</span>
        <span class="font-medium">GST on {{ item.item.label.toLowerCase() }}</span>
        <span class="tabular-nums"> ({{ formatPercent(item.item.gstRate) }} of {{ formatINR(item.amount) }})</span>
      </div>
      <div class="tabular-nums whitespace-nowrap text-right">{{ formatINR(item.gst) }}</div>
    </div>
  </div>
</template>