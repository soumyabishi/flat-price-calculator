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

/**
 * The grand total counts up over 500ms. Printing mid-animation would put a
 * wrong number on a document people rely on, so snap to the final value
 * before the print snapshot is taken. Also covers Cmd/Ctrl+P.
 */
function onBeforePrint() {
  cancelAnimationFrame(rafId)
  animatedTotal.value = result.value.grandTotal
}

onMounted(() => window.addEventListener('beforeprint', onBeforePrint))
onBeforeUnmount(() => window.removeEventListener('beforeprint', onBeforePrint))

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
  /** second line of the calculation */
  calcSub?: string
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
    out.push({
      id: 'discount',
      label: 'Builder discount',
      calc: `${(props.project.discountPct * 100).toFixed(1)}% off rate`,
      calcSub: `${formatINR(props.project.baseRatePerSqft)} → ${formatINR(r.netRatePerSqft)} / sq.ft.`,
      amount: `− ${formatINR(r.discount)}`,
      kind: 'discount',
    })
  }
  out.push({ id: 'net', label: 'Net flat cost', calc: `${props.project.areaSqft.toLocaleString('en-IN')} sq.ft. × ${formatINR(r.netRatePerSqft)}`, amount: formatINR(r.netFlatCost), kind: 'subtotal' })

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

type TotalExplainerData = { label: string, answers: string, includes: string[], excludes?: string[], footnote?: string }

/**
 * Why each headline total is drawn where it is, and what it deliberately
 * swallows. "Total" is ambiguous in this market, so every figure states its
 * own boundaries rather than asking the reader to trust a single number.
 */
const TOTAL_EXPLAINERS: Record<string, TotalExplainerData> = {
  allInclusive: {
    label: 'All-inclusive',
    answers: 'What the flat actually costs once every charge on the builder’s price sheet is counted.',
    includes: [
      'Net flat cost after discount, plus builder charges — PLC, floor-rise, parking, clubhouse, infrastructure',
      'Government charges — GST, stamp duty, registration, transfer duty',
      'Possession and initial charges — advance maintenance, corpus, society formation, utility & maintenance deposits',
    ],
    excludes: [
      'TDS 1% u/s 194-IA — you write the cheque, but it is credited back against what you owe the builder',
      'Interiors / move-in spend',
      'Rent during construction',
    ],
    footnote: 'This is the figure to compare two projects on, per sq.ft. — not the advertised rate.',
  },
  moveInCost: {
    label: 'MOVE-IN COST',
    answers: 'What you need in the bank on the day you take possession and move in.',
    includes: [
      'Everything in All-inclusive',
      'Your interiors / move-in budget — flooring, kitchen, paint, fixtures, appliances',
    ],
    excludes: [
      'Rent during construction',
      'Home-loan interest and EMI',
    ],
    footnote: 'Add this to your loan disbursement and first-year running costs to know your real cash requirement.',
  },
  cashImpact: {
    label: 'TOTAL CASH IMPACT',
    answers: 'What it costs to get from today to actually living in the flat.',
    includes: [
      'Move-in cost',
      'Every month’s rent until handover, with your yearly escalation applied',
    ],
    excludes: [
      'Home-loan interest and EMI — not computed yet',
    ],
    footnote: 'If you have not set a handover date, this assumes an 18-month build. Home-loan interest is not included, so a financed buyer’s true cost is higher by the entire interest component.',
  },
}

type TotalLine = { label: string, sub?: string, value: string, big?: boolean, explainer?: TotalExplainerData }
const totalLines = computed<TotalLine[]>(() => {
  const r = result.value
  const lines: TotalLine[] = []
  if (interiorsOn.value) {
    lines.push({ label: 'MOVE-IN COST', sub: `All-inclusive + ${formatINR(props.project.interiorsBudget, { compact: true })} interiors`, value: formatINR(r.cashNeeded), explainer: TOTAL_EXPLAINERS.moveInCost })
  }
  if (rentOn.value && props.project.possessionStatus === 'underConstruction' && props.project.rentDuringConstruction > 0) {
    lines.push({ label: 'TOTAL CASH IMPACT', sub: `Move-in cost + ${formatINR(r.rentOutlay, { compact: true })} rent`, value: formatINR(r.cashNeeded + r.rentOutlay), explainer: TOTAL_EXPLAINERS.cashImpact })
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

function calcTextClass(kind: InvoiceRow['kind']) {
  if (kind === 'discount') return 'text-success'
  if (kind === 'gst' || kind === 'info') return 'text-xs'
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
      class: {
        th: 'w-3/5 sm:w-2/5 text-xs font-medium uppercase tracking-widest text-muted font-mono',
        td: ({ row }: { row: { original: InvoiceRow } }) => `w-3/5 sm:w-2/5 ${rowClass(row.original.kind)} ${labelClass(row.original.kind)} whitespace-normal wrap-break-word`,
      },
    },
    cell: ({ row }) => {
      const children: unknown[] = []
      if (row.original.arrow) {
        children.push(
          h('span', { class: 'inline-flex items-center gap-1 whitespace-normal wrap-break-word' }, [
            h(resolveComponent('UIcon'), { name: 'i-ph-arrow-elbow-down-right', class: 'size-3 shrink-0 text-muted' }),
            row.original.label,
          ]),
        )
      } else {
        children.push(h('span', { class: labelTextClass(row.original.kind) }, row.original.label))
      }
      // Below the container threshold the Calculation column is hidden, so the
      // working is shown here as a second line instead of being lost.
      if (row.original.calc) {
        children.push(
          h('span', { class: 'calc-fold @min-[30rem]:hidden block text-xs text-muted tabular-num mt-0.5 wrap-break-word' }, [
            row.original.calc,
            row.original.calcSub
              ? h('span', { class: 'block' }, row.original.calcSub)
              : null,
          ]),
        )
      }
      return children
    },
  },
  {
    accessorKey: 'calc',
    header: 'Calculation',
    meta: {
      class: {
        th: 'calc-col hidden @min-[30rem]:table-cell w-2/5 text-left text-xs font-medium uppercase tracking-widest text-muted font-mono',
        td: ({ row }: { row: { original: InvoiceRow } }) => `calc-col hidden @min-[30rem]:table-cell w-2/5 ${rowClass(row.original.kind)} text-left text-xs text-muted tabular-num whitespace-normal wrap-break-word`,
      },
    },
    cell: ({ row }) => h('span', { class: calcTextClass(row.original.kind) }, [
      row.original.calc ?? '',
      row.original.calcSub ? h('span', { class: 'block' }, row.original.calcSub) : null,
    ]),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      class: {
        th: 'w-2/5 sm:w-1/5 text-right text-xs font-medium uppercase tracking-widest text-muted font-mono',
        td: ({ row }: { row: { original: InvoiceRow } }) => `w-2/5 sm:w-1/5 ${rowClass(row.original.kind)} text-right whitespace-nowrap tabular-num text-sm ${amountClass(row.original.kind)}`,
      },
    },
  },
]
</script>

<template>
  <UCard class="print-doc bg-elevated/50 rounded-xl border-default shadow-lg shadow-black/10 dark:shadow-black/40 ring ring-muted/40" :ui="{ body: 'p-0 sm:p-0' }">
    <!-- Header -->
    <div class="flex items-baseline gap-2.5 px-4 sm:px-6 lg:px-10 pt-6 pb-4">
      <div class="text-lg font-bold tracking-tight underline decoration-2 underline-offset-4">
        FlatBuy
      </div>
      <div class="text-[10px] font-mono tracking-[0.25em] text-muted uppercase">
        Cost Calculator
      </div>
      <span class="ml-auto self-center print:hidden">
        <WhyExplainer />
      </span>
    </div>

    <USeparator />

    <!-- Meta grid -->
    <div class="print-keep grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-5 px-4 sm:px-6 lg:px-10 py-5 sm:py-6 text-sm">
      <div class="col-span-2 lg:col-span-1">
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
        <div v-if="result.discount > 0" class="text-xs text-muted tabular-num">after discount {{ formatINR(result.netRatePerSqft) }}</div>
      </div>
    </div>

    <!-- Totals block (moved to top, right under meta) -->
    <div class="print-keep px-4 sm:px-6 lg:px-10 py-6 border-b border-default space-y-5">
      <!-- All-inclusive group -->
      <div class="@container rounded-lg border border-default p-3.5 sm:p-4">
        <div class="flex items-center">
          <div class="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">All-inclusive</div>
          <TotalExplainer v-bind="TOTAL_EXPLAINERS.allInclusive" />
        </div>
        <!-- The total, what it is made of, and the rate it works out to all read
             across in a single row once the card is wide enough, and stack when
             it is not. Decided by container width, not viewport: the desktop
             split leaves this pane far narrower than the window. The threshold
             is set so the "Flat + builder · rate" caption still fits on one
             line in its column — below it, a single column gives it full width. -->
        <div class="mt-1 grid grid-cols-1 gap-x-6 gap-y-3 @min-[27rem]:grid-cols-2 @min-[27rem]:items-start">
          <div>
            <div class="text-[1.75rem] sm:text-2xl font-bold tabular-num text-primary">{{ formatINR(animatedTotal) }}</div>
            <div class="text-xs text-muted mt-0.5">Flat + builder + govt + possession</div>
          </div>
          <div>
            <div class="text-base sm:text-lg font-semibold tabular-num">{{ formatINR(result.saleConsideration) }}</div>
            <div class="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-xs text-muted">
              <span>Flat + builder</span>
              <span class="tabular-num">
                · all-in ₹{{ Math.round(result.flatBuilderPerSqft).toLocaleString('en-IN') }} / sq.ft.
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Move-in / total cash impact -->
      <div v-if="totalLines.length" class="rounded-lg border border-default p-4 grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4">
        <div v-for="line in totalLines" :key="line.label">
          <div class="flex items-center">
            <div class="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">{{ line.label }}</div>
            <TotalExplainer v-if="line.explainer" v-bind="line.explainer" />
          </div>
          <div class="mt-1 text-xl sm:text-2xl font-bold tabular-num">{{ line.value }}</div>
          <div v-if="line.sub" class="text-xs text-muted mt-0.5">{{ line.sub }}</div>
        </div>
      </div>
    </div>

    <!-- Line items -->
    <!-- The 3-column invoice only fits once this box itself is wide enough, so
         the fold is decided by container width, not viewport width. That also
         covers the 1024-1280px range where the desktop split leaves this pane
         narrower than a tablet screen. -->
    <div class="@container mx-3 sm:mx-6 lg:mx-10 mt-6">
      <UTable
        :data="rows"
        :columns="columns"
        class="[&_table]:table-fixed [&_table]:w-full"
        :ui="{
          root: 'overflow-visible',
          thead: '[&>tr>th]:py-2.5 [&>tr>th]:px-1.5 sm:[&>tr>th]:px-3 [&>tr>th]:bg-muted',
          tbody: 'divide-y divide-default/60',
          tr: 'hover:bg-transparent',
          td: 'py-2.5 px-1.5 sm:px-3 align-baseline',
        }"
      />
    </div>

    <!-- Loan note -->
    <div v-if="project.loan.enabled" class="print-keep px-4 sm:px-6 lg:px-10 py-6">
      <div class="rounded-lg bg-elevated/50 p-3 text-sm">
        <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span class="font-medium flex items-center gap-1.5 shrink-0"><UIcon name="i-ph-bank" class="size-4 text-muted" /> Loan</span>
          <span class="tabular-num">{{ formatINR(project.loan.loanAmount) }} @ {{ project.loan.interestRate }}% × {{ project.loan.tenureYears }}y</span>
        </div>
        <div class="text-xs text-muted mt-1">EMI & interest computation coming soon — inputs are saved</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-default px-4 sm:px-6 lg:px-10 py-4">
      <div class="flex items-center justify-between gap-4 text-[10px] font-mono tracking-[0.15em] text-muted uppercase">
        <span>FlatBuy Cost Calculator</span>
        <span class="hidden sm:inline tabular-num">Doc {{ docNo }} · Issued {{ today }}</span>
      </div>
    </div>
  </UCard>
</template>