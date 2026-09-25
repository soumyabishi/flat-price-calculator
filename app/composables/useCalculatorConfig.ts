export type RateFieldId =
  | 'flatSize'
  | 'basePricePerSqft'
  | 'amenitiesPerSqft'
  | 'carParkingFixed'
  | 'facingPremiumPerSqft'
  | 'floorRisePerSqft'
  | 'floorRiseFloors'
  | 'viewPremiumPerSqft'
  | 'gstRate'
  | 'stampDutyRate'
  | 'transferDutyRate'
  | 'registrationFeeRate'
  | 'legalFeeFixed'
  | 'gstOnLegalRate'
  | 'corpusFundPerSqft'
  | 'maintenancePerSqft'
  | 'gstOnMaintenanceRate'

export type RateConfig = {
  id: RateFieldId
  label: string
  hint?: string
  kind: 'sqft' | 'rate' | 'fixed'
  suffix?: string
  group: 'property' | 'taxes' | 'handover'
}

export type Formula =
  | { type: 'perSqft'; rate: RateFieldId }
  | { type: 'perSqftPerFloor'; rate: RateFieldId; floors: RateFieldId }
  | { type: 'fixed'; rate: RateFieldId }
  | { type: 'percentOf'; rate: RateFieldId; base: 'flatValue' | 'legal' | 'maintenance' }

export type LineItem = {
  id: string
  label: string
  category: 'property' | 'taxes' | 'handover'
  timing: string
  formula: Formula
  rateDetail?: string
}

export type Rates = Record<RateFieldId, number>

export const DEFAULT_RATES: Rates = {
  flatSize: 1200,
  basePricePerSqft: 7299,
  amenitiesPerSqft: 350,
  carParkingFixed: 300000,
  facingPremiumPerSqft: 50,
  floorRisePerSqft: 20,
  floorRiseFloors: 0,
  viewPremiumPerSqft: 0,
  gstRate: 0.05,
  stampDutyRate: 0.04,
  transferDutyRate: 0.015,
  registrationFeeRate: 0.005,
  legalFeeFixed: 15000,
  gstOnLegalRate: 0.18,
  corpusFundPerSqft: 50,
  maintenancePerSqft: 72,
  gstOnMaintenanceRate: 0.18,
}

export const RATE_CONFIGS: RateConfig[] = [
  { id: 'flatSize', label: 'Flat size', kind: 'sqft', suffix: 'sq. ft.', group: 'property' },
  { id: 'basePricePerSqft', label: 'Base price per sq. ft.', kind: 'sqft', suffix: '₹ / sq. ft.', group: 'property' },
  { id: 'amenitiesPerSqft', label: 'Amenities & infra per sq. ft.', kind: 'sqft', suffix: '₹ / sq. ft.', group: 'property' },
  { id: 'carParkingFixed', label: 'Car parking (fixed)', hint: 'Fixed cost for the flat configuration (e.g. 3 BHK, 2 tandem).', kind: 'fixed', suffix: '₹', group: 'property' },
  { id: 'facingPremiumPerSqft', label: 'Facing premium per sq. ft.', hint: 'East / North facing premium.', kind: 'sqft', suffix: '₹ / sq. ft.', group: 'property' },
  { id: 'floorRisePerSqft', label: 'Floor rise rate per sq. ft.', hint: 'Charged per floor above the floor-rise start floor.', kind: 'sqft', suffix: '₹ / sq. ft. / floor', group: 'property' },
  { id: 'floorRiseFloors', label: 'Floors above floor-rise start', hint: 'Number of floors the floor rise applies to (e.g. from 7th floor up).', kind: 'rate', suffix: 'floors', group: 'property' },
  { id: 'viewPremiumPerSqft', label: 'View premium per sq. ft.', hint: 'Corner / park / ORR facing premium.', kind: 'sqft', suffix: '₹ / sq. ft.', group: 'property' },
  { id: 'gstRate', label: 'GST rate', kind: 'rate', suffix: '%', group: 'taxes' },
  { id: 'stampDutyRate', label: 'Stamp duty rate', kind: 'rate', suffix: '%', group: 'taxes' },
  { id: 'transferDutyRate', label: 'Transfer duty rate', kind: 'rate', suffix: '%', group: 'taxes' },
  { id: 'registrationFeeRate', label: 'Registration fee rate', kind: 'rate', suffix: '%', group: 'taxes' },
  { id: 'legalFeeFixed', label: 'Legal / documentation fee', kind: 'fixed', suffix: '₹', group: 'handover' },
  { id: 'gstOnLegalRate', label: 'GST on legal fees', kind: 'rate', suffix: '%', group: 'handover' },
  { id: 'corpusFundPerSqft', label: 'Corpus fund per sq. ft.', kind: 'sqft', suffix: '₹ / sq. ft.', group: 'handover' },
  { id: 'maintenancePerSqft', label: 'Maintenance per sq. ft.', hint: '24 months', kind: 'sqft', suffix: '₹ / sq. ft.', group: 'handover' },
  { id: 'gstOnMaintenanceRate', label: 'GST on maintenance', kind: 'rate', suffix: '%', group: 'handover' },
]

export const DEFAULT_ITEMS: LineItem[] = [
  { id: 'base-price', label: 'Base Price', category: 'property', timing: 'Milestones', formula: { type: 'perSqft', rate: 'basePricePerSqft' } },
  { id: 'amenities', label: 'Amenities & Infra', category: 'property', timing: 'Milestones', formula: { type: 'perSqft', rate: 'amenitiesPerSqft' } },
  { id: 'car-parking', label: 'Car Parking', category: 'property', timing: 'Milestones', formula: { type: 'fixed', rate: 'carParkingFixed' }, rateDetail: 'Fixed (e.g. 2 Tandem for 3 BHK)' },
  { id: 'facing-premium', label: 'Facing Premium', category: 'property', timing: 'Milestones', formula: { type: 'perSqft', rate: 'facingPremiumPerSqft' } },
  { id: 'floor-rise', label: 'Floor Rise Charges', category: 'property', timing: 'Milestones', formula: { type: 'perSqftPerFloor', rate: 'floorRisePerSqft', floors: 'floorRiseFloors' } },
  { id: 'view-premium', label: 'View Premium', category: 'property', timing: 'Milestones', formula: { type: 'perSqft', rate: 'viewPremiumPerSqft' }, rateDetail: 'Corner / Park / ORR facing' },
  { id: 'gst', label: 'GST', category: 'taxes', timing: 'Milestones', formula: { type: 'percentOf', rate: 'gstRate', base: 'flatValue' } },
  { id: 'stamp-duty', label: 'Stamp Duty', category: 'taxes', timing: 'Registration Day', formula: { type: 'percentOf', rate: 'stampDutyRate', base: 'flatValue' } },
  { id: 'transfer-duty', label: 'Transfer Duty', category: 'taxes', timing: 'Registration Day', formula: { type: 'percentOf', rate: 'transferDutyRate', base: 'flatValue' } },
  { id: 'registration-fee', label: 'Registration Fee', category: 'taxes', timing: 'Registration Day', formula: { type: 'percentOf', rate: 'registrationFeeRate', base: 'flatValue' } },
  { id: 'legal-fee', label: 'Legal / Documentation Charges', category: 'handover', timing: 'Handover', formula: { type: 'fixed', rate: 'legalFeeFixed' } },
  { id: 'gst-legal', label: 'GST on Legal Fees', category: 'handover', timing: 'Handover', formula: { type: 'percentOf', rate: 'gstOnLegalRate', base: 'legal' } },
  { id: 'corpus-fund', label: 'Corpus Fund', category: 'handover', timing: 'Handover', formula: { type: 'perSqft', rate: 'corpusFundPerSqft' } },
  { id: 'maintenance', label: 'Maintenance Charges (24 months)', category: 'handover', timing: 'Handover', formula: { type: 'perSqft', rate: 'maintenancePerSqft' } },
  { id: 'gst-maintenance', label: 'GST on Maintenance', category: 'handover', timing: 'Handover', formula: { type: 'percentOf', rate: 'gstOnMaintenanceRate', base: 'maintenance' } },
]

export const CATEGORY_META: Record<LineItem['category'], { label: string; timing: string }> = {
  property: { label: 'Property Cost', timing: 'Milestones' },
  taxes: { label: 'Taxes & Government Fees', timing: 'Registration' },
  handover: { label: 'Handover Charges', timing: 'Handover' },
}