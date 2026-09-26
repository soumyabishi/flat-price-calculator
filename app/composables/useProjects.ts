import type { Project } from './useProjectConfig'
import { createProject } from './useProjectConfig'

const STORAGE_KEY = 'flatbuy-projects-v2'

/**
 * Seed projects from real price sheets (reproduce each sheet's own totals):
 * - Cloudswood Skye C-2204 (payment-plan sheet)
 * - Rajapushpa Imperia (ready-to-move tower)
 * - GHR Callisto T2&3 (under construction)
 * - Anvita IVANA C&F tower
 */
function seedProjects(): Project[] {
  function patch(p: Project, fn: (set: (id: string, props: any) => void) => void) {
    const set = (id: string, props: any) => {
      const item = p.items.find(i => i.id === id)!
      Object.assign(item, props, { enabled: true })
    }
    fn(set)
    return p
  }

  // 1. Cloudswood Skye C-2204 — 1835 sft, floor 22, base 8,199
  const skye = createProject('Cloudswood Skye C-2204', {
    areaSqft: 1835,
    floorNo: 22,
    baseRatePerSqft: 8199,
    possessionStatus: 'underConstruction',
  })
  patch(skye, (set) => {
    set('plc', { label: 'East/North Facing Premium', basis: 'perSqft', value: 100, gstApplicable: false })
    set('other-builder', { label: 'Garden View Premium/Corner/ORR', basis: 'perSqft', value: 100, gstApplicable: false })
    set('floor-rise', { value: 20, floors: 17, gstApplicable: false }) // 6th floor onwards
    set('car-parking', { value: 300000, units: 2, gstApplicable: false })
    set('infra', { label: 'Infrastructure charges', basis: 'perSqft', value: 150, gstApplicable: false })
    set('clubhouse', { label: 'Club house charges', basis: 'perSqft', value: 150, gstApplicable: false })
    set('gas', { value: 50000, gstRate: 0.18 })
    set('legal', { value: 25000, gstRate: 0.18 })
    set('corpus-fund', { value: 50, gstApplicable: false })
    set('advance-maintenance', { label: 'Advance Maintenance (1 Year)', basis: 'perSqft', value: 48, gstRate: 0.18, gstApplicable: true })
  })

  // 2. Rajapushpa Imperia — ready to move, no GST on base
  const imperia = createProject('Rajapushpa Imperia', {
    areaSqft: 1675,
    floorNo: 12,
    baseRatePerSqft: 8299,
    possessionStatus: 'readyToMove',
  })
  patch(imperia, (set) => {
    set('plc', { label: 'East/North facing charges', basis: 'perSqft', value: 50, gstApplicable: false })
    set('other-builder', { label: 'Corner/View premium', basis: 'perSqft', value: 50, gstApplicable: false })
    set('floor-rise', { value: 20, floors: 8, gstApplicable: false }) // 5th floor onwards
    set('car-parking', { value: 550000, units: 1, gstApplicable: false })
    set('infra', { label: 'W.E.G.I (Water, Electricity, Gas, Infra & Copper)', basis: 'perSqft', value: 300, gstApplicable: false })
    set('clubhouse', { label: 'Towards Clubhouse', basis: 'flat', value: 400000, gstApplicable: false })
    set('legal', { value: 30000, gstApplicable: false })
    set('corpus-fund', { value: 75, gstApplicable: false })
    set('advance-maintenance', { label: 'Advance Maintenance (24 months)', basis: 'perSqft', value: 168, gstRate: 0.18, gstApplicable: true })
  })

  // 3. GHR Callisto T2&3 — under construction
  const callisto = createProject('GHR Callisto T2&3', {
    areaSqft: 1535,
    floorNo: 9,
    baseRatePerSqft: 7199,
    possessionStatus: 'underConstruction',
  })
  patch(callisto, (set) => {
    set('plc', { label: 'East & North Facing Premium', basis: 'perSqft', value: 50, gstApplicable: false })
    set('other-builder', { label: 'Corner & Courtyard Facing Premium', basis: 'perSqft', value: 50, gstApplicable: false })
    set('floor-rise', { value: 20, floors: 4, gstApplicable: false }) // per floor
    set('car-parking', { value: 250000, units: 1, gstApplicable: false })
    set('clubhouse', { label: 'Clubhouse, Amenities & Infrastructure', basis: 'flat', value: 400000, gstApplicable: false })
    set('evc', { label: 'Electric Vehicle Charge Point', value: 90000, gstApplicable: false })
    set('legal', { value: 15000, gstRate: 0.18 })
    set('corpus-fund', { value: 42, gstApplicable: false })
    set('advance-maintenance', { label: 'Maintenance (2 years @ ₹4/mo)', basis: 'perSqft', value: 96, gstRate: 0.18, gstApplicable: true })
  })

  // 4. Anvita IVANA C&F tower
  const ivana = createProject('Anvita IVANA C&F', {
    areaSqft: 1675,
    floorNo: 11,
    baseRatePerSqft: 7699,
    possessionStatus: 'underConstruction',
  })
  patch(ivana, (set) => {
    set('plc', { label: 'East/North facing charges', basis: 'perSqft', value: 50, gstApplicable: false })
    set('other-builder', { label: 'Corner/Outer View charges', basis: 'perSqft', value: 50, gstApplicable: false })
    set('floor-rise', { value: 20, floors: 5, gstApplicable: false }) // 7th onwards
    set('car-parking', { value: 300000, units: 2, gstApplicable: false })
    set('clubhouse', { label: 'Amenities', basis: 'perSqft', value: 350, gstApplicable: false })
    set('legal', { value: 15000, gstRate: 0.18 })
    set('corpus-fund', { value: 50, gstApplicable: false })
    set('advance-maintenance', { label: 'Maintenance (24 months)', basis: 'perSqft', value: 72, gstRate: 0.18, gstApplicable: true })
  })

  return [skye, imperia, callisto, ivana]
}

/** Default new-user project: 1720 sqft, 7th floor, ₹7,200 base */
function createDefaultProject(): Project {
  const p = createProject('My Flat', {
    areaSqft: 1720,
    floorNo: 7,
    baseRatePerSqft: 7200,
  })
  // floor rise from 7th floor onwards: on floor 7 there's 1 charged floor
  const fr = p.items.find(i => i.id === 'floor-rise')!
  fr.value = 20
  fr.floors = 1
  fr.enabled = true
  return p
}

function load(): Project[] {
  if (import.meta.server) return [createDefaultProject(), ...seedProjects()]
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  }
  catch {}
  return [createDefaultProject(), ...seedProjects()]
}

export function useProjects() {
  const projects = useState<Project[]>('projects', () => import.meta.server ? load() : [])

  // Hydrate from localStorage on client after SSR (useState payload would carry server seeds)
  if (import.meta.client) {
    const stored = load()
    if (stored.length) {
      projects.value = stored
    }
  }

  // Explicit save model: edits stay in memory only; Save button persists to localStorage
  const dirty = ref(false)

  function save() {
    if (!import.meta.client) return false
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
      dirty.value = false
      return true
    }
    catch {
      return false
    }
  }

  // mark dirty on any project edit (deep)
  watch(projects, () => {
    if (import.meta.client) dirty.value = true
  }, { deep: true })

  const activeId = useState<string>('activeProjectId', () => projects.value[0]?.id ?? '')

  // Restore last-selected tab project on client (activeId SSR payload holds server seed id)
  if (import.meta.client) {
    const savedActiveId = (() => {
      try { return localStorage.getItem('flatbuy-active-id') } catch { return null }
    })()
    if (savedActiveId && projects.value.some(p => p.id === savedActiveId)) {
      activeId.value = savedActiveId
    }
    watch(activeId, (id) => {
      try { localStorage.setItem('flatbuy-active-id', id) } catch {}
    })
  }

  const activeProject = computed(() =>
    projects.value.find(p => p.id === activeId.value) ?? projects.value[0]!,
  )

  function addProject(name: string): Project {
    const p = createProject(name)
    p.baseRatePerSqft = 0
    p.areaSqft = 0
    projects.value.push(p)
    activeId.value = p.id
    return p
  }

  function removeProject(id: string) {
    projects.value = projects.value.filter(p => p.id !== id)
    if (!projects.value.length) {
      projects.value = [createProject('My Flat')]
      activeId.value = projects.value[0]!.id
    }
    else if (activeId.value === id) {
      activeId.value = projects.value[0]!.id
    }
  }

  function duplicateProject(id: string): Project | undefined {
    const src = projects.value.find(p => p.id === id)
    if (!src) return
    const copy: Project = JSON.parse(JSON.stringify(src))
    copy.id = `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    copy.name = `${src.name} (copy)`
    copy.createdAt = Date.now()
    copy.updatedAt = Date.now()
    projects.value.push(copy)
    activeId.value = copy.id
    return copy
  }

  function exportJSON(): string {
    return JSON.stringify(projects.value, null, 2)
  }

  function importJSON(json: string): boolean {
    try {
      const parsed = JSON.parse(json)
      if (!Array.isArray(parsed)) return false
      projects.value = parsed
      if (!projects.value.find(p => p.id === activeId.value)) {
        activeId.value = projects.value[0]?.id ?? ''
      }
      return true
    }
    catch {
      return false
    }
  }

  return {
    projects,
    activeId,
    activeProject,
    addProject,
    removeProject,
    duplicateProject,
    exportJSON,
    importJSON,
    save,
    dirty,
  }
}