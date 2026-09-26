export type ChargeBasis = 'perSqft' | 'perFloor' | 'flat' | 'perUnit'

export type SectionKey =
  | 'property'
  | 'builder'
  | 'government'
  | 'possession'

export type ChargeItem = {
  id: string
  label: string
  section: SectionKey
  basis: ChargeBasis
  /** value: perSqft → ₹/sqft; perFloor → ₹/sqft/floor; flat → ₹; perUnit → ₹/unit */
  value: number
  /** for perUnit: number of units (parkings) */
  units?: number
  /** for perFloor: floors above floor-rise start */
  floors?: number
  /** optional item: user can enable/disable (builder/possession sections) */
  optional: boolean
  enabled: boolean
  /** GST charged on this item */
  gstApplicable: boolean
  gstRate: number
  /** hint text explaining the charge */
  hint?: string
  /** excluded from grand total (TDS — deduction mechanism, not extra cost) */
  excludedFromTotal?: boolean
  /** excluded from the lumpsum sale consideration (registration-time items like legal, gas) */
  registrationTime?: boolean
}

export type PossessionStatus = 'underConstruction' | 'readyToMove'

export type Project = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  possessionStatus: PossessionStatus
  /** basic details */
  areaSqft: number
  floorNo: number
  /** section 2: base price */
  baseRatePerSqft: number
  discountPct: number
  /** all charge items (sections 3-5) */
  items: ChargeItem[]
  /** section 6: loan (inputs only) */
  loan: {
    enabled: boolean
    downPayment: number
    loanAmount: number
    loanAmountManual: boolean
    interestRate: number
    tenureYears: number
    processingFeePct: number
  }
  /** section 7: interiors */
  interiorsBudget: number
  /** interiors toggle — when off, budget excluded from move-in cost entirely */
  interiorsOn: boolean
  /** monthly rent paid during construction (under-construction projects) */
  rentDuringConstruction: number
  /** rent toggle — when off, rent excluded from move-in cost entirely */
  rentOn: boolean
  /** yearly rent escalation % (e.g. 0.08 = 8%) */
  rentEscalationPct: number
  /** expected handover date (ISO yyyy-mm) — used to estimate rent outlay */
  handoverDate: string
}

export type ChargeTemplate = {
  id: string
  label: string
  section: SectionKey
  basis: ChargeBasis
  defaultValue: number
  units?: number
  optional: boolean
  gstApplicable: boolean
  hint?: string
  /** not part of grand total */
  excludedFromTotal?: boolean
  /** excluded from sale consideration (registration-time items) */
  registrationTime?: boolean
}

export const CHARGE_TEMPLATES: ChargeTemplate[] = [
  // pseudo item: base-price GST (shown only under construction)
  { id: 'base-gst', label: 'GST (on flat cost)', section: 'builder', basis: 'flat', defaultValue: 0, optional: false, gstApplicable: false, hint: '5% of net flat cost — under construction only' },
  // section 3: builder / project charges
  { id: 'floor-rise', label: 'Floor rise charges', section: 'builder', basis: 'perFloor', defaultValue: 20, optional: true, gstApplicable: true, hint: '₹/sq.ft. per floor above floor-rise start' },
  { id: 'plc', label: 'PLC (Preferred Location)', section: 'builder', basis: 'perSqft', defaultValue: 0, optional: true, gstApplicable: true, hint: 'Preferred location charges' },
  { id: 'car-parking', label: 'Car parking', section: 'builder', basis: 'perUnit', defaultValue: 300000, units: 1, optional: true, gstApplicable: true, hint: '₹ per parking × number of parkings' },
  { id: 'clubhouse', label: 'Clubhouse / amenity charges', section: 'builder', basis: 'flat', defaultValue: 400000, optional: true, gstApplicable: true, hint: 'Lump sum or per sq.ft — set basis per project' },
  { id: 'infra', label: 'Infrastructure / WEG charges', section: 'builder', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: true, hint: 'Water, electricity, gas, infrastructure' },
  { id: 'development', label: 'Development charges', section: 'builder', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: true },
  { id: 'electricity', label: 'Electricity connection', section: 'builder', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: true },
  { id: 'water', label: 'Water connection', section: 'builder', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: true },
  { id: 'gas', label: 'Gas pipeline connection', section: 'builder', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: true, hint: 'e.g. Centralised gas connection', registrationTime: true },
  { id: 'evc', label: 'EV charging point', section: 'builder', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: true, hint: 'Electric vehicle charge point (optional)' },
  { id: 'legal', label: 'Legal / documentation charges', section: 'builder', basis: 'flat', defaultValue: 15000, optional: false, gstApplicable: true, hint: '18% GST usually applies', registrationTime: true },
  { id: 'other-builder', label: 'Other builder charges', section: 'builder', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: false },

  // section 4: government charges
  { id: 'stamp-duty', label: 'Stamp duty', section: 'government', basis: 'perSqft', defaultValue: 4, optional: false, gstApplicable: false, hint: '% of net flat cost (state-specific)' },
  { id: 'transfer-duty', label: 'Transfer duty / cess', section: 'government', basis: 'perSqft', defaultValue: 1.5, optional: false, gstApplicable: false, hint: '% of net flat cost (state-specific)' },
  { id: 'registration-fee', label: 'Registration fee', section: 'government', basis: 'perSqft', defaultValue: 0.5, optional: false, gstApplicable: false, hint: '% of net flat cost (state-specific)' },
  { id: 'tds', label: 'TDS (1% u/s 194-IA)', section: 'government', basis: 'perSqft', defaultValue: 1, optional: false, gstApplicable: false, hint: 'Deducted from builder payment, deposited with IT dept via Form 26QB — not an extra cost', excludedFromTotal: true },

  // section 5: possession / initial charges
  { id: 'corpus-fund', label: 'Corpus / sinking fund', section: 'possession', basis: 'perSqft', defaultValue: 50, optional: false, gstApplicable: false },
  { id: 'advance-maintenance', label: 'Advance maintenance', section: 'possession', basis: 'flat', defaultValue: 0, optional: false, gstApplicable: true, hint: 'e.g. ₹/sq.ft × months — enter total' },
  { id: 'society-formation', label: 'Society / association formation', section: 'possession', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: false },
  { id: 'maintenance-deposit', label: 'Maintenance deposit', section: 'possession', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: false },
  { id: 'utility-deposit', label: 'Utility deposits', section: 'possession', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: false, hint: 'Electricity + water deposits' },
  { id: 'other-possession', label: 'Other possession charges', section: 'possession', basis: 'flat', defaultValue: 0, optional: true, gstApplicable: false },
]

const DEFAULT_GST_RATE = 5

export function createProject(name: string, overrides: Partial<Project> = {}): Project {
  const items: ChargeItem[] = CHARGE_TEMPLATES
    .filter(t => t.id !== 'base-gst')
    .map(t => ({
    id: t.id,
    label: t.label,
    section: t.section,
    basis: t.basis,
    value: t.defaultValue,
    units: t.units,
    floors: t.basis === 'perFloor' ? 0 : undefined,
    optional: t.optional,
    enabled: !t.optional,
    gstApplicable: t.gstApplicable,
    gstRate: t.id === 'legal' ? 18 : DEFAULT_GST_RATE,
    hint: t.hint,
    excludedFromTotal: t.excludedFromTotal,
    registrationTime: t.registrationTime,
  }))

  // government items with basis perSqft store percentages in `value` (0.04 = 4%)
  // they are percent-of-net-flat-cost — handled specially in compute
  for (const item of items) {
    if (item.section === 'government') item.basis = 'flat' // percent math lives in compute
  }

  return {
    id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    possessionStatus: 'underConstruction',
    areaSqft: 1200,
    floorNo: 0,
    baseRatePerSqft: 7299,
    discountPct: 0,
    items,
    loan: {
      enabled: false,
      downPayment: 0,
      loanAmount: 0,
      loanAmountManual: false,
      interestRate: 8.5,
      tenureYears: 20,
      processingFeePct: 0,
    },
    interiorsBudget: 0,
    interiorsOn: false,
    rentDuringConstruction: 0,
    rentOn: false,
    rentEscalationPct: 0.08,
    handoverDate: '',
    ...overrides,
  }
}