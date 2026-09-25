import type { LineItem, Rates } from './useCalculatorConfig'
import { DEFAULT_ITEMS } from './useCalculatorConfig'

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
  item: LineItem
  amount: number
  rateDetail: string
  calculation: string
}

export type ComputedCategory = {
  key: 'property' | 'taxes' | 'handover'
  label: string
  items: ComputedItem[]
  subtotal: number
}

export type ComputedResult = {
  categories: ComputedCategory[]
  flatValue: number
  grandTotal: number
}

export function computeBreakdown(rates: Rates, items: LineItem[] = DEFAULT_ITEMS): ComputedResult {
  const size = rates.flatSize || 0
  const flatValue = items
    .filter(i => i.category === 'property')
    .reduce((sum, i) => sum + computeItem(i, rates, size).amount, 0)

  const categories: ComputedCategory[] = []
  let grandTotal = 0

  for (const key of ['property', 'taxes', 'handover'] as const) {
    const catItems = items
      .filter(i => i.category === key)
      .map(i => computeItem(i, rates, size, flatValue))
    const subtotal = catItems.reduce((s, c) => s + c.amount, 0)
    grandTotal += subtotal
    categories.push({
      key,
      label: key === 'property' ? 'Property Cost' : key === 'taxes' ? 'Taxes & Government Fees' : 'Handover Charges',
      items: catItems,
      subtotal,
    })
  }

  return { categories, flatValue, grandTotal }
}

function computeItem(
  item: LineItem,
  rates: Rates,
  size: number,
  flatValue = 0,
): ComputedItem {
  const f = item.formula
  let amount = 0
  let rateDetail = item.rateDetail ?? ''
  let calculation = ''

  switch (f.type) {
    case 'perSqft': {
      const rate = rates[f.rate] || 0
      amount = size * rate
      rateDetail = rateDetail || `${formatINR(rate)} per sq. ft.`
      calculation = size > 0 && rate > 0 ? `${formatINR(rate)} × ${size.toLocaleString('en-IN')}` : '—'
      break
    }
    case 'perSqftPerFloor': {
      const rate = rates[f.rate] || 0
      const floors = rates[f.floors] || 0
      amount = size * rate * floors
      rateDetail = rateDetail || `${formatINR(rate)} per sq. ft. × ${floors} floor${floors === 1 ? '' : 's'}`
      calculation = rate > 0 && floors > 0 && size > 0
        ? `${formatINR(rate)} × ${size.toLocaleString('en-IN')} × ${floors} floors`
        : 'No floor rise'
      break
    }
    case 'fixed': {
      const rate = rates[f.rate] || 0
      amount = rate
      rateDetail = rateDetail || `Fixed ${formatINR(rate)}`
      calculation = 'Fixed'
      break
    }
    case 'percentOf': {
      const rate = rates[f.rate] || 0
      const baseAmount =
        f.base === 'flatValue' ? flatValue
        : f.base === 'legal' ? rates.legalFeeFixed || 0
        : size * (rates.maintenancePerSqft || 0)
      amount = baseAmount * rate
      rateDetail = rateDetail || `${formatPercent(rate)} of ${baseLabel(f.base)}`
      calculation = baseAmount > 0 ? `${formatPercent(rate)} of ${formatINR(baseAmount)}` : '—'
      break
    }
  }

  return { item, amount, rateDetail, calculation }
}

function baseLabel(base: 'flatValue' | 'legal' | 'maintenance'): string {
  switch (base) {
    case 'flatValue': return 'Flat Value'
    case 'legal': return 'Legal Fees'
    case 'maintenance': return 'Maintenance'
  }
}