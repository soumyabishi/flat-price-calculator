<script setup lang="ts">
import type { Project } from '~/composables/useProjectConfig'
import { computeProject, formatINR } from '~/composables/computeProject'

const props = defineProps<{
  project: Project
}>()

const result = computed(() => computeProject(props.project))
</script>

<template>
  <UCard class="rounded-xl border-default">
    <div class="text-muted">Total flat cost</div>
    <div class="mt-1 text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
      {{ formatINR(result.grandTotal) }}
    </div>
    <div class="mt-1 text-xs text-muted">
      All-inclusive · ₹{{ result.perSqft.toLocaleString('en-IN', { maximumFractionDigits: 0 }) }} / sq.ft.
    </div>

    <USeparator class="my-4" />

    <!-- base price rows -->
    <div class="space-y-1.5 text-sm">
      <div class="flex items-baseline justify-between gap-4">
        <div>
          <span class="font-medium">Base flat cost</span>
          <span class="text-xs text-muted tabular-nums"> ({{ project.areaSqft.toLocaleString('en-IN') }} × {{ formatINR(project.baseRatePerSqft) }})</span>
        </div>
        <div class="tabular-nums whitespace-nowrap">{{ formatINR(result.baseFlatCost) }}</div>
      </div>
      <div v-if="result.discount > 0" class="flex items-baseline justify-between gap-4 text-success">
        <div class="font-medium">Builder discount ({{ (project.discountPct * 100).toFixed(1) }}%)</div>
        <div class="tabular-nums whitespace-nowrap">− {{ formatINR(result.discount) }}</div>
      </div>
      <div class="flex items-baseline justify-between gap-4">
        <div class="font-semibold">Net flat cost</div>
        <div class="tabular-nums whitespace-nowrap font-semibold">{{ formatINR(result.netFlatCost) }}</div>
      </div>
    </div>

    <USeparator class="my-4" />

    <!-- charge sections -->
    <div class="space-y-1">
      <details
        v-for="cat in result.sections"
        :key="cat.key"
        class="group"
        :open="cat.key === 'builder'"
      >
        <summary class="flex items-center justify-between cursor-pointer list-none py-2 rounded-md">
          <span class="flex items-center gap-2 font-semibold">
            <UIcon
              :name="cat.key === 'builder' ? 'i-ph-wrench' : cat.key === 'government' ? 'i-ph-bank' : 'i-ph-key'"
              class="size-4 text-muted"
            />
            {{ cat.label }}
          </span>
          <span class="flex items-center gap-2 tabular-nums">
            {{ formatINR(cat.subtotal) }}
            <UIcon
              name="i-ph-caret-down"
              class="size-4 text-muted transition-transform duration-200 group-open:rotate-180"
            />
          </span>
        </summary>

        <div class="pb-2 space-y-1">
          <template v-for="ci in cat.items" :key="ci.item.id">
            <ChargeRow
              v-if="ci.item.id !== 'tds'"
              :item="ci"
              :project="project"
            />
          </template>
          <USeparator />
          <div class="flex justify-between text-sm text-muted">
            <span>{{ cat.label }} subtotal</span>
            <span class="tabular-nums">{{ formatINR(cat.subtotal) }}</span>
          </div>
        </div>
      </details>
    </div>

    <!-- TDS separate -->
    <USeparator class="my-3" />
    <div class="flex items-baseline justify-between gap-4 text-sm text-muted">
      <div>
        <span class="font-medium">TDS 1% (not in total)</span>
        <div class="text-xs mt-0.5">Deducted from builder payment · deposit via Form 26QB</div>
      </div>
      <div class="tabular-nums whitespace-nowrap">{{ formatINR(result.tds) }}</div>
    </div>

    <!-- Interiors -->
    <div v-if="project.interiorsBudget > 0" class="flex items-baseline justify-between gap-4 text-sm mt-2">
      <div class="font-medium">Interiors / move-in</div>
      <div class="tabular-nums whitespace-nowrap">{{ formatINR(project.interiorsBudget) }}</div>
    </div>

    <USeparator class="my-4" />

    <!-- grand total -->
    <div class="flex items-baseline justify-between gap-4">
      <div>
        <div class="text-lg font-bold">Grand total</div>
        <div class="text-xs text-muted mt-0.5">Property + charges · adjusts with premiums</div>
      </div>
      <div class="text-2xl font-bold tabular-nums text-right">
        {{ formatINR(result.grandTotal) }}
      </div>
    </div>

    <!-- loan strip -->
    <div v-if="project.loan.enabled" class="mt-4 rounded-lg bg-elevated/50 p-3 text-sm">
      <div class="flex items-center justify-between">
        <span class="font-medium flex items-center gap-1.5"><UIcon name="i-ph-bank" class="size-4 text-muted" /> Loan</span>
        <span class="tabular-nums">{{ formatINR(project.loan.loanAmount) }} @ {{ project.loan.interestRate }}% × {{ project.loan.tenureYears }}y</span>
      </div>
      <div class="text-xs text-muted mt-1">EMI & interest computation coming soon — inputs are saved</div>
    </div>
  </UCard>
</template>