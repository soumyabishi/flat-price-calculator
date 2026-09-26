import type { ChargeItem, Project } from './useProjectConfig'

export function formatINR(value: number, opts: { compact?: boolean } = {}): string {
  const safe = Number.isFinite(value) ? value : 0
  if (opts.compact) {
    if (Math.abs(safe) >= 1e7) return `₹${(safe / 1e7).toFixed(2)} Cr`
    if (Math.abs(safe) >= 1e5) return `₹${(safe / 1e5).toFixed(2)} L`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safe)
}

export function formatPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return `${(safe * 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}%`
}

export type ComputedItem = {
  item: ChargeItem
  amount: number
  gst: number
  total: number
  calculation: string
}

export type ComputedSection = {
  key: string
  label: string
  items: ComputedItem[]
  subtotal: number
}

export type ComputedResult = {
  baseFlatCost: number
  discount: number
  netFlatCost: number
  /** net flat cost + builder item amounts (GST added separately) */
  saleConsideration: number
  sections: ComputedSection[]
  /** all-inclusive acquisition price (interiors excluded) */
  grandTotal: number
  /** grand total + interiors budget — for affordability planning */
  cashNeeded: number
  /** all-inclusive price per sqft */
  perSqft: number
  tds: number
  gstTotal: number
  /** estimated rent paid from now until handover (escalation applied) */
  rentOutlay: number
  /** months from now until handover date */
  monthsToHandover: number
}

/**
 * Rent paid until handover: monthly rent with yearly escalation.
 * Returns months remaining and the total outlay (0 if ready to move / no date).
 */
export function computeRentOutlay(project: Project): { months: number, outlay: number } {
  if (project.possessionStatus !== 'underConstruction') return { months: 0, outlay: 0 }
  if (!project.handoverDate) return { months: 0, outlay: 0 }
  if (!project.rentDuringConstruction) return { months: 0, outlay: 0 }

  const now = new Date()
  const handover = new Date(`${project.handoverDate}-01T00:00:00`)
  let months = (handover.getFullYear() - now.getFullYear()) * 12 + (handover.getMonth() - now.getMonth())
  if (Number.isNaN(months)) return { months: 0, outlay: 0 }
  months = Math.max(0, months)
  if (months === 0) return { months: 0, outlay: 0 }

  const esc = project.rentEscalationPct || 0
  let outlay = 0
  for (let m = 0; m < months; m++) {
    const year = Math.floor(m / 12)
    outlay += project.rentDuringConstruction * Math.pow(1 + esc, year)
  }
  return { months, outlay: Math.round(outlay) }
}

const GOVERNMENT_IDS = new Set(['stamp-duty', 'transfer-duty', 'registration-fee', 'tds'])

export function computeProject(project: Project): ComputedResult {
  const { areaSqft, baseRatePerSqft, discountPct, possessionStatus } = project

  // section 2
  const baseFlatCost = areaSqft * baseRatePerSqft
  const discount = baseFlatCost * (discountPct || 0)
  const netFlatCost = baseFlatCost - discount

  // active items
  const active = project.items.filter(i =>
    (i.optional ? i.enabled : true)
    && !(i.id === 'floor-rise' && !(i.floors || 0)),
  )

  function computeAmount(item: ChargeItem): number {
    switch (item.basis) {
      case 'perSqft': return areaSqft * (item.value || 0)
      case 'perFloor': return areaSqft * (item.value || 0) * (item.floors || 0)
      case 'perUnit': return (item.value || 0) * (item.units || 0)
      case 'flat': {
        if (GOVERNMENT_IDS.has(item.id)) return netFlatCost * (item.value || 0)
        return item.value || 0
      }
    }
  }

  function calculation(item: ChargeItem, amount: number): string {
    if (GOVERNMENT_IDS.has(item.id)) return `${formatPercent(item.value)} of ${formatINR(netFlatCost)}`
    switch (item.basis) {
      case 'perSqft': return `${formatINR(item.value)} × ${areaSqft.toLocaleString('en-IN')}`
      case 'perFloor': return `${formatINR(item.value)} × ${areaSqft.toLocaleString('en-IN')} × ${item.floors} floors`
      case 'perUnit': return `${formatINR(item.value)} × ${item.units}${(item.units ?? 0) === 1 ? ' parking' : ' parkings'}`
      case 'flat': return amount > 0 ? formatINR(item.value) : '—'
    }
  }

  // GST applies only on builder items when under construction (property base GST handled below)
  function itemGst(item: ChargeItem, amount: number): number {
    if (!item.gstApplicable) return 0
    if (possessionStatus === 'readyToMove') return 0
    return amount * (item.gstRate || 0)
  }

  const sectionLabels: Record<string, string> = {
    builder: 'Builder / Project Charges',
    government: 'Government Charges',
    possession: 'Possession / Initial Charges',
  }

  const sections: ComputedSection[] = []
  let grandTotal = netFlatCost
  let tds = 0
  let gstTotal = 0

  // First pass: builder item amounts (GST rows computed after we know the sale consideration)
  type PendingItem = { item: ChargeItem, amount: number, calculation: string }
  const pending: Record<string, PendingItem[] | undefined> = {}
  for (const key of ['builder', 'government', 'possession'] as const) {
    pending[key] = active
      .filter(i => i.section === key)
      .map((item) => {
        const amount = computeAmount(item)
        return { item, amount, calculation: calculation(item, amount) }
      })
      .filter(ci => ci.amount > 0 || ci.item.optional === false)
  }

  // Sale consideration (Skye-style): net flat cost + builder item amounts (excluding registration-time items)
  const builderItems = pending.builder ?? []
  const builderSum = builderItems
    .filter(ci => !ci.item.registrationTime)
    .reduce((s, ci) => s + ci.amount, 0)
  const saleConsideration = netFlatCost + builderSum

  // Base GST row: applies on sale consideration when under construction AND item enabled
  // Per-item GST: each builder item may carry its own GST rate instead (mutually exclusive usage)
  const baseGstItem = active.find(i => i.id === 'base-gst')

  for (const key of ['builder', 'government', 'possession'] as const) {
    const secItems: ComputedItem[] = (pending[key] ?? []).map((p) => {
      const { item, amount, calculation: calc } = p
      // government items have no GST
      let gst = 0
      if (key !== 'government' && item.gstApplicable && possessionStatus === 'underConstruction') {
        gst = amount * (item.gstRate || 0)
      }
      if (item.id === 'tds') tds = amount
      if (key === 'builder') gstTotal += gst
      if (key === 'possession') gstTotal += gst
      return { item, amount, gst, total: amount + gst, calculation: calc }
    })

    if (key === 'builder' && baseGstItem?.enabled !== false && possessionStatus === 'underConstruction') {
      // 5% GST on the full sale consideration (flat + builder charges), Skye/IVANA style
      const gstOnBase = saleConsideration * (baseGstItem?.gstRate || DEFAULT_BASE_GST)
      secItems.unshift({
        item: baseGstItem ?? { ...builderItems[0]!.item, id: 'base-gst', label: 'GST (on flat cost)' },
        amount: gstOnBase,
        gst: 0,
        total: gstOnBase,
        calculation: `${formatPercent(baseGstItem?.gstRate || DEFAULT_BASE_GST)} of ${formatINR(saleConsideration)}`,
      })
      gstTotal += gstOnBase
    }

    const subtotal = secItems.reduce((s, ci) => s + ci.total, 0)

    // add subtotal (excludes TDS)
    const addable = secItems.filter(ci => !ci.item.excludedFromTotal)
    grandTotal += addable.reduce((s, ci) => s + ci.total, 0)

    sections.push({
      key,
      label: sectionLabels[key] ?? key,
      items: secItems,
      subtotal,
    })
  }

  return {
    baseFlatCost,
    discount,
    netFlatCost,
    saleConsideration,
    sections,
    grandTotal,
    /** grand total + interiors budget (affordability view) */
    cashNeeded: grandTotal + (project.interiorsBudget || 0),
    perSqft: areaSqft > 0 ? grandTotal / areaSqft : 0,
    tds,
    gstTotal,
    ...(() => {
      const rent = computeRentOutlay(project)
      return { rentOutlay: rent.outlay, monthsToHandover: rent.months }
    })(),
  }
}

const DEFAULT_BASE_GST = 0.05