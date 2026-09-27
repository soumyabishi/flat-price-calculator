<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Project } from '~/composables/useProjectConfig'
import { computeProject, formatINR, formatPercent } from '~/composables/computeProject'

const props = defineProps<{
  project: Project
}>()

const result = computed(() => computeProject(props.project))

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

const interiorsOn = computed(() => props.project.interiorsOn)
const rentOn = computed(() => props.project.rentOn)

const docNo = computed(() => `EST-${props.project.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || '0001'}`)
const today = ref('')
onMounted(() => {
  today.value = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
})
const possessionLabel = computed(() => props.project.possessionStatus === 'underConstruction' ? 'Under construction' : 'Ready to move')

type InvoiceRow = {
  id: string
  label: string
  calc?: string
  amount: string
  kind: 'item' | 'gst' | 'subtotal' | 'section' | 'info' | 'discount'
  arrow?: boolean
  icon?: string
}

const rows = computed<InvoiceRow[]>(() => {
  const r = result.value
  const out: InvoiceRow[] = []

  out.push({ id: 'base', label: 'Base flat cost', calc: `${props.project.areaSqft.toLocaleString('en-IN')} sq.ft. × ${formatINR(props.project.baseRatePerSqft)}`, amount: formatINR(r.baseFlatCost), kind: 'item' })
  if (r.discount > 0) {
    out.push({ id: 'discount', label: 'Builder discount', calc: `${(props.project.discountPct * 100).toFixed(1)}% of ${formatINR(r.baseFlatCost)}`, amount: `− ${formatINR(r.discount)}`, kind: 'discount' })
  }
  out.push({ id: 'net', label: 'Net flat cost', amount: formatINR(r.netFlatCost), kind: 'subtotal' })

  for (const cat of r.sections) {
    const icon = cat.key === 'builder' ? 'i-ph-wrench' : cat.key === 'government' ? 'i-ph-bank' : 'i-ph-key'
    out.push({ id: `sec-${cat.key}`, label: cat.label.toUpperCase(), amount: '', kind: 'section', icon })
    let gstRows: InvoiceRow[] = []
    for (const ci of cat.items) {
      if (ci.item.id === 'base-gst') {
        gstRows = [
          { id: 'sale', label: 'Sale consideration', calc: r.saleFormula, amount: formatINR(r.saleConsideration), kind: 'subtotal' },
          { id: 'base-gst', label: 'GST on flat cost', calc: ci.calculation, amount: formatINR(ci.amount), kind: 'gst' },
        ]
        continue
      }
      if (ci.item.id === 'tds') continue
      out.push({
        id: ci.item.id,
        label: ci.item.label,
        calc: ci.calculation && ci.calculation !== '—' && !ci.calculation.startsWith('No') ? ci.calculation : undefined,
        amount: formatINR(ci.amount),
        kind: 'item',
      })
      if (ci.gst > 0) {
        out.push({
          id: `${ci.item.id}-gst`,
          label: 'GST',
          calc: `${formatPercent(ci.item.gstRate)} of ${formatINR(ci.amount)}`,
          amount: formatINR(ci.gst),
          kind: 'gst',
          arrow: true,
        })
      }
    }
    out.push({ id: `sub-${cat.key}`, label: `${cat.label} subtotal`, amount: formatINR(cat.subtotal), kind: 'subtotal' })
    out.push(...gstRows)
  }

  out.push({ id: 'tds', label: 'TDS 1% (not in total)', calc: 'Deducted from builder payment · Form 26QB', amount: formatINR(r.tds), kind: 'info' })
  if (interiorsOn.value) {
    out.push({ id: 'interiors', label: 'Interiors / move-in (not in total)', calc: 'Own spending, outside the builder quote', amount: formatINR(props.project.interiorsBudget), kind: 'info' })
  }
  if (rentOn.value && props.project.possessionStatus === 'underConstruction' && props.project.rentDuringConstruction > 0) {
    out.push({
      id: 'rent',
      label: 'Rent during construction (not in total)',
      calc: `₹${props.project.rentDuringConstruction.toLocaleString('en-IN')}/mo × ${r.monthsToHandover} months${r.rentEstimated ? ' (handover date not set — assuming 18)' : ' to handover'}${(props.project.rentEscalationPct || 0) > 0 ? ` · ${(props.project.rentEscalationPct * 100).toFixed(0)}% / yr` : ''}`,
      amount: formatINR(r.rentOutlay),
      kind: 'info',
    })
  }

  return out
})

type TotalLine = { label: string, sub?: string, value: string, big?: boolean }
const totalLines = computed<TotalLine[]>(() => {
  const r = result.value
  const lines: TotalLine[] = []
  if (interiorsOn.value) {
    lines.push({ label: 'MOVE-IN COST', sub: `All-inclusive + ${formatINR(props.project.interiorsBudget, { compact: true })} interiors`, value: formatINR(r.cashNeeded) })
  }
  if (rentOn.value && props.project.possessionStatus === 'underConstruction' && props.project.rentDuringConstruction > 0) {
    lines.push({ label: 'TOTAL CASH IMPACT', sub: `Move-in cost + ${formatINR(r.rentOutlay, { compact: true })} rent`, value: formatINR(r.cashNeeded + r.rentOutlay) })
  }
  return lines
})

function labelClass(kind: InvoiceRow['kind']) {
  return ''
}

function labelTextClass(kind: InvoiceRow['kind']) {
  if (kind === 'gst') return 'text-xs text-muted'
  if (kind === 'section') return 'text-xs font-medium uppercase tracking-widest text-muted'
  if (kind === 'subtotal') return 'text-highlighted'
  if (kind === 'discount') return 'font-medium text-success'
  if (kind === 'info') return 'text-muted'
  return ''
}

function amountClass(kind: InvoiceRow['kind']) {
  if (kind === 'subtotal') return 'text-highlighted'
  if (kind === 'discount') return 'font-medium text-success'
  if (kind === 'gst' || kind === 'info') return 'text-xs text-muted'
  return ''
}

function rowClass(kind: InvoiceRow['kind']) {
  if (kind === 'section') return 'border-t-3 border-default bg-muted'
  if (kind === 'subtotal') return 'border-t-3 border-default'
  return ''
}

const columns: TableColumn<InvoiceRow>[] = [
  {
    accessorKey: 'label',
    header: 'Description',
    meta: {
      class: { th: 'w-2/5 text-xs font-medium uppercase tracking-widest text-muted font-mono', td: ({ row }: { row: { original: InvoiceRow } }) => `w-2/5 ${rowClass(row.original.kind)} ${labelClass(row.original.kind)} whitespace-normal wrap-break-word` },
    },
    cell: ({ row }) => {
      if (row.original.arrow) {
        return h('span', { class: 'inline-flex items-center gap-1 whitespace-normal wrap-break-word' }, [
          h(resolveComponent('UIcon'), { name: 'i-ph-arrow-elbow-down-right', class: 'size-3 shrink-0 text-muted' }),
          row.original.label,
        ])
      }
      return h('span', { class: labelTextClass(row.original.kind) }, row.original.label)
    },
  },
  {
    accessorKey: 'calc',
    header: 'Calculation',
    meta: {
      class: { th: 'w-2/5 text-left text-xs font-medium uppercase tracking-widest text-muted font-mono', td: ({ row }: { row: { original: InvoiceRow } }) => `w-2/5 ${rowClass(row.original.kind)} text-left text-xs text-muted tabular-num whitespace-normal wrap-break-word` },
    },
    cell: ({ row }) => h('span', row.original.calc ?? ''),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      class: { th: 'w-1/5 text-right text-xs font-medium uppercase tracking-widest text-muted font-mono', td: ({ row }: { row: { original: InvoiceRow } }) => `w-1/5 ${rowClass(row.original.kind)} text-right whitespace-nowrap tabular-num text-sm ${amountClass(row.original.kind)}` },
    },
  },
]
</script>

<template>
  <UCard class="bg-elevated/50 rounded-xl border-default shadow-lg shadow-black/10 dark:shadow-black/40 ring ring-muted/40" :ui="{ body: 'p-0 sm:p-0' }">
    <!-- Header -->
    <div class="flex items-start justify-between gap-6 px-6 sm:px-10 pt-8 pb-6">
      <div>
        <div class="text-xl font-bold tracking-tight underline decoration-2 underline-offset-4">
          FlatBuy
        </div>
        <div class="mt-1.5 text-[10px] font-mono tracking-[0.25em] text-muted uppercase">
          Cost Calculator
        </div>
      </div>
      <div class="text-right">
        <div class="flex items-center justify-end gap-2">
          <span class="size-1.5 rounded-full bg-primary" />
          <span class="text-3xl sm:text-4xl font-bold tracking-tight">Estimate</span>
        </div>
        <div class="mt-1 text-xs font-mono text-muted tabular-num">{{ docNo }}</div>
      </div>
    </div>

    <USeparator />

    <!-- Meta grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 px-6 sm:px-10 py-6 text-sm">
      <div class="col-span-2 sm:col-span-1">
        <div class="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">Prepared for</div>
        <div class="mt-1.5 font-semibold leading-snug">{{ project.name }}</div>
        <div class="mt-0.5 text-muted">
          {{ project.areaSqft.toLocaleString('en-IN') }} sq.ft.<template v-if="project.floorNo">
            · Floor {{ project.floorNo }}</template>
        </div>
        <div class="text-muted">{{ possessionLabel }}</div>
      </div>
      <div>
        <div class="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">Issue date</div>
        <div class="mt-1.5 font-medium tabular-num">{{ today }}</div>
      </div>
      <div>
        <div class="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">Rate / sq.ft.</div>
        <div class="mt-1.5 font-medium tabular-num">{{ formatINR(project.baseRatePerSqft) }}</div>
        <div class="mt-3 text-[10px] font-mono tracking-[0.2em] text-muted uppercase">All-inclusive / sq.ft.</div>
        <div class="mt-1 font-medium tabular-num">₹{{ result.perSqft.toLocaleString('en-IN', { maximumFractionDigits: 0 }) }}</div>
      </div>
    </div>

    <!-- Totals block (moved to top, right under meta) -->
    <div class="px-6 sm:px-10 py-6 border-b border-default">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
        <div>
          <div class="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">All-inclusive</div>
          <div class="mt-1 text-2xl font-bold tabular-num text-primary">{{ formatINR(animatedTotal) }}</div>
          <div class="text-xs text-muted mt-0.5">Flat + builder + govt + possession</div>
        </div>
        <div v-for="line in totalLines" :key="line.label">
          <div class="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">{{ line.label }}</div>
          <div class="mt-1 text-2xl font-bold tabular-num">{{ line.value }}</div>
          <div v-if="line.sub" class="text-xs text-muted mt-0.5">{{ line.sub }}</div>
        </div>
      </div>
    </div>

    <!-- Line items -->
    <div class="mx-6 sm:mx-10 mt-6">
      <UTable
        :data="rows"
        :columns="columns"
        class="[&_table]:table-fixed [&_table]:w-full"
        :ui="{
          root: 'overflow-visible',
          thead: '[&>tr>th]:py-2.5 [&>tr>th]:px-2 sm:[&>tr>th]:px-3 [&>tr>th]:bg-muted',
          tbody: 'divide-y divide-default/60',
          tr: 'hover:bg-transparent',
          td: 'py-2.5 px-2 sm:px-3 align-baseline',
        }"
      />
    </div>

    <!-- Loan note -->
    <div v-if="project.loan.enabled" class="px-6 sm:px-10 py-6">
      <div class="rounded-lg bg-elevated/50 p-3 text-sm">
        <div class="flex items-center justify-between">
          <span class="font-medium flex items-center gap-1.5"><UIcon name="i-ph-bank" class="size-4 text-muted" /> Loan</span>
          <span class="tabular-num">{{ formatINR(project.loan.loanAmount) }} @ {{ project.loan.interestRate }}% × {{ project.loan.tenureYears }}y</span>
        </div>
        <div class="text-xs text-muted mt-1">EMI & interest computation coming soon — inputs are saved</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-default px-6 sm:px-10 py-4">
      <div class="flex items-center justify-between gap-4 text-[10px] font-mono tracking-[0.15em] text-muted uppercase">
        <span>FlatBuy Cost Calculator</span>
        <span class="hidden sm:inline tabular-num">Doc {{ docNo }} · Issued {{ today }}</span>
      </div>
    </div>
  </UCard>
</template>