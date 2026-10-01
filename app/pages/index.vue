<script setup lang="ts">
import type { NavigationMenuItem, RadioGroupItem } from '@nuxt/ui'
import { formatINR } from '~/composables/computeProject'
import { SHEET_PEEK } from '~/composables/sheetPeek'
import { usePrintSummary } from '~/composables/usePrintSummary'
import type { ChargeItem } from '~/composables/useProjectConfig'

const {
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
} = useProjects()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear + i)

const handoverMonth = computed(() => {
  const m = Number(active.value.handoverDate?.split('-')[1])
  return m ? MONTHS[m - 1] : undefined
})

const handoverYear = computed(() => {
  const y = Number(active.value.handoverDate?.split('-')[0])
  return y || undefined
})

function onHandoverMonth(month: string) {
  const y = Number(active.value.handoverDate?.split('-')[0]) || currentYear
  const idx = MONTHS.indexOf(month) + 1
  if (!idx) return
  const day = active.value.handoverDate?.split('-')[2] ?? '01'
  active.value.handoverDate = `${y}-${String(idx).padStart(2, '0')}-${day}`
}

function onHandoverYear(year: number) {
  const m = Number(active.value.handoverDate?.split('-')[1]) || 1
  const day = active.value.handoverDate?.split('-')[2] ?? '01'
  active.value.handoverDate = `${year}-${String(m).padStart(2, '0')}-${day}`
}

const justSaved = ref(false)
function onSave() {
  if (save()) {
    justSaved.value = true
    setTimeout(() => (justSaved.value = false), 2000)
  }
}

const active = computed(() => activeProject.value!)

type SectionDef = {
  key: string
  title: string
  icon: string
}

function itemsFor(project: { items: ChargeItem[] }, section: string): ChargeItem[] {
  return project.items.filter(i => i.section === section)
}

const fileInput = ref<HTMLInputElement | null>(null)

const activeTab = ref('basic')

/**
 * Possession status drives real maths — GST applies on the flat cost only while
 * under construction — so each option carries an icon and says what it does to
 * the total. `description` is the key RadioGroup reads; the previous `hint` was
 * silently ignored, which is why the GST line never showed.
 */
const POSSESSION_OPTIONS: RadioGroupItem[] = [
  { label: 'Under construction', value: 'underConstruction', icon: 'i-ph-crane', description: 'GST applies on flat cost' },
  { label: 'Ready to move', value: 'readyToMove', icon: 'i-ph-key', description: 'No GST on flat cost' },
]

const navItems = computed((): NavigationMenuItem[][] => [
  stepItems.value.map(s => ({
    label: s.title,
    icon: s.icon,
    active: activeTab.value === s.value,
    onSelect: () => { activeTab.value = s.value },
  })),
])

const tabIndex = computed(() => Math.max(0, stepItems.value.findIndex(s => s.value === activeTab.value)))
const prevStep = computed(() => tabIndex.value > 0 ? stepItems.value[tabIndex.value - 1] : undefined)
const nextStep = computed(() => tabIndex.value < stepItems.value.length - 1 ? stepItems.value[tabIndex.value + 1] : undefined)

const stepItems = computed(() => {
  const items = [
    { label: 'Flat', title: 'Flat', value: 'basic', icon: 'i-ph-info', slot: 'basic' },
    { label: 'Builder', title: 'Builder', value: 'builder', icon: 'i-ph-wrench', slot: 'builder' },
    { label: 'Government', title: 'Government', value: 'government', icon: 'i-ph-bank', slot: 'government' },
    { label: 'Possession', title: 'Possession', value: 'possession', icon: 'i-ph-key', slot: 'possession' },
    { label: 'Loan', title: 'Loan', value: 'loan', icon: 'i-ph-percent', slot: 'loan' },
    { label: 'Interiors', title: 'Interiors', value: 'interiors', icon: 'i-ph-paint-brush', slot: 'interiors' },
  ]
  if (active.value.possessionStatus === 'underConstruction') {
    items.push({ label: 'Rent', title: 'Rent', value: 'rent', icon: 'i-ph-buildings', slot: 'rent' })
  }
  return items
})

const deleteTarget = ref<{ id: string, name: string } | undefined>()

const { printSummary } = usePrintSummary()

const isDesktop = useMediaQuery('(min-width: 1024px)')

function confirmDelete() {
  if (!deleteTarget.value) return
  removeProject(deleteTarget.value.id)
  deleteTarget.value = undefined
}

function onImport(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const ok = importJSON(String(reader.result))
    if (!ok) {
      const toast = useToast()
      toast.add({ title: 'Import failed', description: 'Invalid projects JSON', color: 'error' })
    }
  }
  reader.readAsText(file)
  target.value = ''
}

function onExport() {
  const blob = new Blob([exportJSON()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'flatbuy-projects.json'
  a.click()
  URL.revokeObjectURL(url)
}

const leftWidth = ref(50)
const dragging = ref(false)
const splitContainer = ref<HTMLElement | null>(null)

/** The resizable split only exists on large screens. */
const leftStyle = computed(() => (isDesktop.value ? { width: leftWidth.value + '%' } : {}))

function onDragStart(e: PointerEvent) {
  dragging.value = true
  const handle = e.currentTarget as HTMLElement
  handle.setPointerCapture(e.pointerId)
  const move = (ev: PointerEvent) => {
    const container = handle.parentElement
    if (!container) return
    const rect = container.getBoundingClientRect()
    const pct = ((ev.clientX - rect.left) / rect.width) * 100
    leftWidth.value = Math.min(75, Math.max(25, pct))
  }
  const up = () => {
    dragging.value = false
    handle.removeEventListener('pointermove', move)
    handle.removeEventListener('pointerup', up)
  }
  handle.addEventListener('pointermove', move)
  handle.addEventListener('pointerup', up)
}
</script>

<template>
  <div class="h-screen flex flex-col bg-default text-default overflow-hidden print-root">
    <UContainer class="shrink-0 py-2.5 w-full  border-b border-b-default print:hidden">
      <header>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2.5 shrink-0">
            <UIcon name="i-ph-buildings-fill" class="size-5 text-primary shrink-0" />
            <span class="text-lg font-bold tracking-tight">FlatBuy</span>
            <UBadge color="neutral" variant="subtle" size="sm">v2</UBadge>
          </div>

          <!-- Project tabs get their own scrollable row on small screens. -->
          <div class="hidden sm:flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <UFieldGroup v-for="p in projects" :key="p.id" class="shrink-0">
              <UButton
                :variant="p.id === active.id ? 'solid' : 'outline'"
                color="neutral"
                size="sm"
                :label="p.name"
                @click="activeId = p.id"
              />
            <UDropdownMenu
                :items="[[
                  { label: 'Duplicate', icon: 'i-ph-copy', onSelect: () => duplicateProject(p.id) },
                  { label: 'Remove', icon: 'i-ph-trash', color: 'error' as const, onSelect: () => deleteTarget = p },
                ]]"
                :content="{ align: 'end' }"
              >
                <UButton
                  size="sm"
                  :variant="p.id === active.id ? 'solid' : 'outline'"
                  color="neutral"
                  icon="i-ph-dots-three-vertical"
                  :aria-label="`More actions for ${p.name}`"
                  class="!px-1.5"
                />
              </UDropdownMenu>
            </UFieldGroup>
            <UButton size="sm" variant="ghost" color="neutral" icon="i-ph-plus" class="shrink-0" @click="addProject(`Project ${projects.length + 1}`)">
              New
            </UButton>
          </div>

          <!-- Tabs own the free space; actions stay content-sized so the project
               names span the full header width as they did before. `ml-auto`
               only matters below sm, where the tabs are on their own row. -->
          <div class="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <UButton
              to="/guide"
              variant="outline"
              color="neutral"
              size="sm"
              icon="i-ph-book-open-text"
              aria-label="Home buying guide"
            >
              <span class="hidden sm:inline">Guide</span>
            </UButton>
            <UButton
              :variant="dirty ? 'solid' : 'outline'"
              :color="dirty ? 'success' : 'neutral'"
              size="sm"
              :icon="justSaved ? 'i-ph-check' : 'i-ph-floppy-disk'"
              :disabled="!dirty"
              :aria-label="dirty ? 'Save project' : 'All changes saved'"
              @click="onSave"
            >
              <span class="hidden sm:inline">{{ justSaved ? 'Saved' : dirty ? 'Save' : 'Saved' }}</span>
            </UButton>
            <!-- Compare is hidden for now: it ranks projects on absolute rupee
                 totals, which is misleading when the flats are different sizes.
                 Restore once the table compares on a per-sq.ft. basis. -->
            <UButton
              v-if="false"
              to="/compare"
              variant="outline"
              color="neutral"
              size="sm"
              icon="i-ph-scales"
              :disabled="projects.length < 2"
              aria-label="Compare projects"
            >
              <span class="hidden sm:inline">Compare</span>
            </UButton>
            <UDropdownMenu
              :items="[[
                { label: 'Add project', icon: 'i-ph-plus', onSelect: () => addProject(`Project ${projects.length + 1}`) },
                { label: 'Duplicate current', icon: 'i-ph-copy', onSelect: () => duplicateProject(active.id) },
                { label: 'Export JSON', icon: 'i-ph-download-simple', onSelect: () => onExport() },
                { label: 'Import JSON', icon: 'i-ph-upload-simple', onSelect: () => fileInput?.click() },
                { label: 'Download PDF', icon: 'i-ph-printer', onSelect: () => printSummary(active) },
                { label: 'Delete current', icon: 'i-ph-trash', color: 'error' as const, onSelect: () => removeProject(active.id) },
              ]]"
            >
              <UButton icon="i-ph-dots-three" variant="outline" color="neutral" size="sm" aria-label="More actions" />
            </UDropdownMenu>
            <input ref="fileInput" type="file" accept=".json" class="hidden" @change="onImport">
          </div>
        </div>

        <!-- Mobile-only project switcher -->
        <div class="sm:hidden -mx-4 mt-2.5 px-4 flex items-center gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <UFieldGroup v-for="p in projects" :key="p.id" class="shrink-0">
            <UButton
              :variant="p.id === active.id ? 'solid' : 'outline'"
              color="neutral"
              size="sm"
              :label="p.name"
              @click="activeId = p.id"
            />
            <UDropdownMenu
              :items="[[
                { label: 'Duplicate', icon: 'i-ph-copy', onSelect: () => duplicateProject(p.id) },
                { label: 'Remove', icon: 'i-ph-trash', color: 'error' as const, onSelect: () => deleteTarget = p },
              ]]"
              :content="{ align: 'start' }"
            >
              <UButton
                size="sm"
                :variant="p.id === active.id ? 'solid' : 'outline'"
                color="neutral"
                icon="i-ph-dots-three-vertical"
                :aria-label="`More actions for ${p.name}`"
                class="!px-1.5"
              />
            </UDropdownMenu>
          </UFieldGroup>
          <UButton size="sm" variant="ghost" color="neutral" icon="i-ph-plus" class="shrink-0" @click="addProject(`Project ${projects.length + 1}`)">
            New
          </UButton>
        </div>
      </header>
    </UContainer>

    <!-- Delete confirmation modal -->
    <UModal
      :open="deleteTarget !== undefined"
      :overlay="true"
      @update:open="(v) => { if (!v) deleteTarget = undefined }"
    >
        <template #content>
          <div class="p-6 space-y-4">
            <div class="flex items-start gap-3">
              <UIcon name="i-ph-warning-circle" class="size-6 text-warning shrink-0" />
              <div>
                <h3 class="font-semibold">Delete project</h3>
                <p class="text-sm text-muted mt-1">
                  Delete <span class="font-medium text-default">{{ deleteTarget?.name }}</span>? All its rates and charges will be removed. This cannot be undone.
                </p>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" color="neutral" size="sm" @click="deleteTarget = undefined">
                Cancel
              </UButton>
              <UButton color="error" size="sm" icon="i-ph-trash" @click="confirmDelete">
                Delete
              </UButton>
            </div>
          </div>
        </template>
    </UModal>

    <!-- Custom split: inputs left, summary right; draggable divider, each panel scrolls independently.
         Below lg the divider disappears, inputs take the full width and the summary becomes a bottom sheet. -->
    <div class="flex-1 min-h-0 w-full flex print-split">
      <!-- No bottom padding below lg: the prev/next bar rests directly on the
           summary sheet, so any padding here would push it off the sheet edge. -->
      <section class="h-full w-full min-w-0 flex-1 px-4 sm:px-6 pt-4 sm:pt-6 pb-0 lg:pb-6 flex flex-col lg:flex-row gap-4 sm:gap-6 print:hidden lg:flex-none" :style="leftStyle">
        <!-- Small screens: horizontal step strip -->
        <div class="lg:hidden shrink-0 -mx-4 px-4 overflow-x-auto overscroll-x-contain scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <UNavigationMenu
            orientation="horizontal"
            color="primary"
            variant="pill"
            :items="navItems"
            class="w-max"
          />
        </div>

        <!-- Large screens: sticky vertical rail -->
        <div class="hidden lg:block h-full shrink-0">
          <div class="sticky top-0">
            <div class="mb-3">
              <h2 class="text-base font-semibold text-highlighted">Project details</h2>
              <p class="text-xs text-muted mt-0.5 max-w-40">Fill in the sections to build the stimate</p>
            </div>
            <UNavigationMenu
              orientation="vertical"
              color="primary"
              variant="pill"
              :items="navItems"
              class="w-42"
            />
          </div>
        </div>

        <!-- Right: form section -->
        <div class="flex-1 min-w-0 overflow-y-auto overflow-x-hidden flex flex-col">
          <!-- Fills a short form so the prev/next bar is pushed down onto the
               summary sheet. `lg:flex-none` keeps the desktop layout exactly
               as it was, with the bar sitting right after the content. -->
          <div class="flex-1 lg:flex-none">
            <div v-if="activeTab === 'basic'">
              <div>
                <div class="rounded-lg border border-default p-4 space-y-4">
                  <UFormField label="Project name">
                    <UInput v-model="active.name" size="xl" class="w-full" placeholder="e.g. Rajapushpa Imperia C-2204" />
                  </UFormField>

                  <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Built-up area" size="md">
                      <div class="relative">
                        <UInputNumber
                          v-model="active.areaSqft"
                          :min="0"
                          :increment="false"
                          :decrement="false"
                          disable-wheel-change
                          :formatOptions="{ maximumFractionDigits: 0 }"
                          :ui="{ base: 'pr-16 text-lg/7 px-3 py-2 font-medium' }"
                          class="w-full"
                        />
                        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">sq.ft.</span>
                      </div>
                    </UFormField>

                    <UFormField label="Floor" size="md">
                      <div class="relative">
                        <UInputNumber
                          v-model="active.floorNo"
                          :min="0"
                          :increment="false"
                          :decrement="false"
                          disable-wheel-change
                          :formatOptions="{ maximumFractionDigits: 0 }"
                          :ui="{ base: 'pr-16 text-lg/7 px-3 py-2 font-medium' }"
                          class="w-full"
                        />
                        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">floor</span>
                      </div>
                    </UFormField>
                  </div>

                  <UFormField label="Possession status" size="md">
                    <!-- `icon` on a radio item only renders when the indicator is
                         hidden, since the indicator is where a radio keeps its dot.
                         The dot moves to a checkbox in the top-right instead: the
                         default leading slot is centred under the icon and reads
                         as decoration, whereas a corner checkbox is a familiar
                         "this is picked" signal. aria-checked still comes from the
                         radio itself, so it is announced either way. -->
                    <URadioGroup
                      v-model="active.possessionStatus"
                      :items="POSSESSION_OPTIONS"
                      variant="card"
                      orientation="horizontal"
                      indicator="hidden"
                      :ui="{
                        fieldset: 'w-full gap-x-3 !flex-col sm:!flex-row',
                        item: 'relative flex-1 rounded-lg px-3 py-2.5 min-w-0',
                        icon: 'size-6',
                        description: 'text-[11px] leading-snug',
                      }"
                    >
                      <template #label="{ item, modelValue }">
                        <span class="font-medium text-default">{{ item.label }}</span>
                        <span
                          :class="[
                            'absolute right-3 top-3 flex size-4.5 items-center justify-center rounded-full border transition-colors',
                            modelValue === item.value
                              ? 'border-primary bg-primary text-inverted'
                              : 'border-accented bg-transparent text-transparent',
                          ]"
                          aria-hidden="true"
                        >
                          <UIcon name="i-ph-check" class="size-3" />
                        </span>
                      </template>
                    </URadioGroup>
                  </UFormField>

                  <!-- Handover belongs beside possession status: it only means
                       something while the flat is under construction, and rent
                       during construction is calculated from it. -->
                  <UFormField
                    v-if="active.possessionStatus === 'underConstruction'"
                    label="Expected handover"
                    size="md"
                  >
                    <div class="flex gap-2">
                      <USelect
                        :model-value="handoverMonth"
                        :items="MONTHS"
                        placeholder="Month"
                        class="w-full"
                        @update:model-value="onHandoverMonth"
                      />
                      <USelect
                        :model-value="handoverYear"
                        :items="YEARS"
                        placeholder="Year"
                        class="w-28"
                        @update:model-value="onHandoverYear"
                      />
                    </div>
                  </UFormField>

                  <USeparator class="!my-5" />

                  <UFormField label="Rate per sq.ft." size="md">
                    <div class="relative">
                      <UInputNumber
                        v-model="active.baseRatePerSqft"
                        :min="0"
                        :increment="false"
                        :decrement="false"
                        disable-wheel-change
                        :formatOptions="{ maximumFractionDigits: 2 }"
                        :ui="{ base: 'pr-24 text-lg/7 px-3 py-2 font-medium' }"
                        class="w-full"
                      />
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">₹ / sq.ft.</span>
                    </div>
                  </UFormField>

                  <UFormField label="Builder discount / offer" size="md" hint="Percentage taken off the rate per sq.ft.">
                    <div class="relative">
                      <UInputNumber
                        v-model="active.discountPct"
                        :min="0"
                        :max="0.9"
                        :step="0.005"
                        :increment="false"
                        :decrement="false"
                        disable-wheel-change
                        :formatOptions="{ maximumFractionDigits: 3 }"
                        :ui="{ base: 'pr-8 text-lg/7 px-3 py-2 font-medium' }"
                        class="w-full"
                      />
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">%</span>
                    </div>
                  </UFormField>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'builder'">
              <div >
                <ChargeSection
                  :project="active"
                  title="Builder / project charges"
                  icon="i-ph-wrench"
                  :items="itemsFor(active, 'builder')"
                />
              </div>
            </div>

            <div v-if="activeTab === 'government'">
              <div class="pt-4">
                <ChargeSection
                  :project="active"
                  title="Government charges"
                  icon="i-ph-bank"
                  :items="itemsFor(active, 'government')"
                />
              </div>
            </div>

            <div v-if="activeTab === 'possession'">
              <div>
                <ChargeSection
                  :project="active"
                  title="Possession / initial charges"
                  icon="i-ph-key"
                  :items="itemsFor(active, 'possession')"
                />
              </div>
            </div>

            <div v-if="activeTab === 'loan'">
              <div >
                <section class="rounded-lg border border-default p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <USwitch v-model="active.loan.enabled" size="xs" />
                    <UIcon name="i-ph-bank" class="size-4 text-muted" />
                    <h4 class="text-sm font-semibold flex-1">Home loan</h4>
                  </div>
                  <div v-if="active.loan.enabled" class="space-y-4">
                    <UFormField label="Down payment" size="sm">
                      <UInputNumber
                        v-model="active.loan.downPayment"
                        :min="0"
                        :step="10000"
                        :increment="false"
                        :decrement="false"
                        disable-wheel-change
                        :formatOptions="{ maximumFractionDigits: 0 }"
                        class="w-full"
                      />
                    </UFormField>
                    <UFormField label="Loan amount" size="sm" hint="Auto-filled from total minus down payment; editable">
                      <UInputNumber
                        v-model="active.loan.loanAmount"
                        :min="0"
                        :step="10000"
                        :increment="false"
                        :decrement="false"
                        disable-wheel-change
                        :formatOptions="{ maximumFractionDigits: 0 }"
                        class="w-full"
                      />
                    </UFormField>
                    <div class="grid grid-cols-2 gap-4">
                      <UFormField label="Interest rate (%)" size="sm">
                        <UInputNumber
                          v-model="active.loan.interestRate"
                          :min="0"
                          :max="30"
                          :step="0.05"
                          :increment="false"
                          :decrement="false"
                          disable-wheel-change
                          :formatOptions="{ maximumFractionDigits: 2 }"
                          class="w-full"
                        />
                      </UFormField>
                      <UFormField label="Tenure (years)" size="sm">
                        <UInputNumber
                          v-model="active.loan.tenureYears"
                          :min="1"
                          :max="30"
                          :step="1"
                          :increment="false"
                          :decrement="false"
                          disable-wheel-change
                          :formatOptions="{ maximumFractionDigits: 0 }"
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                    <UFormField label="Processing fee (%)" size="sm">
                      <UInputNumber
                        v-model="active.loan.processingFeePct"
                        :min="0"
                        :step="0.05"
                        :increment="false"
                        :decrement="false"
                        disable-wheel-change
                        :formatOptions="{ maximumFractionDigits: 2 }"
                        class="w-full"
                      />
                    </UFormField>
                  </div>
                  <div v-else class="text-xs text-muted">Toggle on to plan the loan</div>
                </section>
              </div>
            </div>

            <div v-if="activeTab === 'interiors'">
              <div >
                <section class="rounded-lg border border-default p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <USwitch v-model="active.interiorsOn" size="xs" />
                    <UIcon name="i-ph-paint-brush" class="size-4 text-muted" />
                    <h4 class="text-sm font-semibold flex-1">Interiors / move-in budget</h4>
                  </div>
                  <template v-if="active.interiorsOn">
                    <UInputNumber
                      v-model="active.interiorsBudget"
                      :min="0"
                      :step="10000"
                      :increment="false"
                      :decrement="false"
                      disable-wheel-change
                      :formatOptions="{ maximumFractionDigits: 0 }"
                      class="w-full"
                    />
                    <div class="text-xs text-muted mt-2">
                      One-time budget for interiors, furnishing, move-in — not part of the flat price.
                    </div>
                  </template>
                  <div v-else class="text-xs text-muted">Toggle on to plan interiors</div>
                </section>
              </div>
            </div>

            <div v-if="activeTab === 'rent'">
              <div >
                <section class="rounded-lg border border-default p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <USwitch v-model="active.rentOn" size="xs" />
                    <UIcon name="i-ph-buildings" class="size-4 text-muted" />
                    <h4 class="text-sm font-semibold flex-1">Rent during construction</h4>
                  </div>
                  <template v-if="active.rentOn">
                  <div class="space-y-4">
                    <UFormField label="Monthly rent" size="md">
                      <div class="relative">
                        <UInputNumber
                          v-model="active.rentDuringConstruction"
                          :min="0"
                          :step="1"
                          :increment="false"
                          :decrement="false"
                          disable-wheel-change
                          :formatOptions="{ maximumFractionDigits: 0 }"
                          class="w-full"
                        />
                        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">₹ / month</span>
                      </div>
                    </UFormField>
                    <!-- Handover moved to the Flat tab: it is a property of the
                         possession status, not of rent, and rent only consumes it. -->
                    <UFormField label="Annual rent increase" size="md">
                        <div class="relative">
                          <UInputNumber
                            v-model="active.rentEscalationPct"
                            :min="0"
                            :max="0.5"
                            :step="0.01"
                            :increment="false"
                            :decrement="false"
                            disable-wheel-change
                            :formatOptions="{ maximumFractionDigits: 2 }"
                            class="w-full pr-8"
                          />
                          <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">%</span>
                        </div>
                      </UFormField>
                    </div>
                  <div class="text-xs text-muted mt-2">
                    Rent you keep paying until the flat is ready — excluded from the flat price, shown in the summary.
                  </div>
                  </template>
                  <div v-else class="text-xs text-muted">Toggle on to plan rent during construction</div>
                </section>
              </div>
            </div>
          </div>

            <!-- Sticky prev / next. Below lg the bar rests on the collapsed
                 sheet's top edge, so `SHEET_PEEK` is what keeps it flush
                 instead of floating with a gap above the peek. -->
            <div
              class="sticky z-10 -mx-2 sm:-mx-4 px-4 sm:px-6 py-3 bg-default/90 backdrop-blur border-t border-default mt-6 flex items-center justify-between gap-3"
              :style="{ bottom: isDesktop ? '0px' : SHEET_PEEK + 'px' }"
            >
              <UButton
                v-if="prevStep"
                variant="outline"
                color="neutral"
                icon="i-ph-arrow-left"
                class="min-w-0 max-w-[45%]"
                @click="activeTab = prevStep.value"
              >
                <span class="truncate">
                  <span class="hidden sm:inline">Back: </span>{{ prevStep.title }}
                </span>
              </UButton>
              <span v-else />
              <UButton
                v-if="nextStep"
                variant="solid"
                color="primary"
                trailing-icon="i-ph-arrow-right"
                class="min-w-0 max-w-[55%]"
                @click="activeTab = nextStep.value"
              >
                <span class="truncate">
                  <span class="hidden sm:inline">Next: </span>{{ nextStep.title }}
                </span>
              </UButton>
            </div>
        </div>
      </section>

      <!-- Drag handle (large screens only) -->
      <div
        class="hidden lg:block relative w-px shrink-0 cursor-col-resize bg-default border-r border-accented/60"
        @pointerdown="onDragStart"
      >
        <!-- wide hit area + hover rail -->
        <div class="absolute inset-y-0 -inset-x-2.5 z-10 flex items-center justify-center group cursor-col-resize">
          <div
            class="h-12 w-3 rounded-full flex items-center justify-center transition-colors duration-150"
            :class="dragging ? 'bg-primary' : 'bg-accented'"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="size-4 text-muted"
              :class="dragging ? 'text-inverted' : ''"
            />
          </div>
        </div>
      </div>

      <SummaryPane :project="active" />
    </div>
  </div>
</template>
