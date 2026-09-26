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
  sections: ComputedSection[]
  /** net flat cost + builder + government (+ possession) + interiors */
  grandTotal: number
  /** all-inclusive price per sqft */
  perSqft: number
  tds: number
  gstTotal: number
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
  let grandTotal = netFlatCost + project.interiorsBudget
  let tds = 0
  let gstTotal = 0

  for (const key of ['builder', 'government', 'possession'] as const) {
    const secItems = active
      .filter(i => i.section === key)
      .map((item) => {
        const amount = computeAmount(item)
        const gst = key === 'builder' || key === 'possession' ? itemGst(item, amount) : 0
        if (key === 'builder') gstTotal += gst
        if (key === 'possession') gstTotal += gst
        if (item.id === 'tds') tds = amount
        return { item, amount, gst, total: amount + gst, calculation: calculation(item, amount) }
      })
      // hide zero-amount disabled-by-default items
      .filter(ci => ci.amount > 0 || ci.item.optional === false)
    const subtotal = secItems.reduce((s, ci) => s + ci.total, 0)

    if (key === 'builder') {
      // base-price GST row when under construction: 5% of net flat cost
      if (possessionStatus === 'underConstruction') {
        const gstOnBase = netFlatCost * DEFAULT_BASE_GST
        const defaultGstItem = active.find(i => i.id === 'base-gst')
        if (defaultGstItem) {
          secItems.unshift({
            item: defaultGstItem,
            amount: gstOnBase,
            gst: 0,
            total: gstOnBase,
            calculation: `${formatPercent(DEFAULT_BASE_GST)} of ${formatINR(netFlatCost)}`,
          })
        }
        gstTotal += gstOnBase
      }
    }

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
    sections,
    grandTotal,
    perSqft: areaSqft > 0 ? grandTotal / areaSqft : 0,
    tds,
    gstTotal,
  }
}

const DEFAULT_BASE_GST = 0.05