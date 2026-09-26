<script setup lang="ts">
import { formatINR } from '~/composables/computeProject'
import type { ChargeItem } from '~/composables/useProjectConfig'
import { CalendarDate } from '@internationalized/date'

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

const handoverCalendarDate = computed(() => {
  const v = active.value.handoverDate
  if (!v) return undefined
  const [y, m, d] = v.split('-').map(Number)
  if (!y || !m) return undefined
  return new CalendarDate(y, m, d || 1)
})

function onHandoverChange(val: unknown) {
  if (val && typeof val === 'object' && 'year' in val) {
    const d = val as { year: number, month: number, day: number }
    active.value.handoverDate = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day ?? 1).padStart(2, '0')}`
  }
  else {
    active.value.handoverDate = ''
  }
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

const tabItems = computed(() => {
  const items = [
    { label: 'Flat', value: 'basic', icon: 'i-ph-info', slot: 'basic' },
    { label: 'Builder', value: 'builder', icon: 'i-ph-wrench', slot: 'builder' },
    { label: 'Government', value: 'government', icon: 'i-ph-bank', slot: 'government' },
    { label: 'Possession', value: 'possession', icon: 'i-ph-key', slot: 'possession' },
    { label: 'Loan', value: 'loan', icon: 'i-ph-percent', slot: 'loan' },
    { label: 'Interiors', value: 'interiors', icon: 'i-ph-paint-brush', slot: 'interiors' },
  ]
  if (active.value.possessionStatus === 'underConstruction') {
    items.push({ label: 'Rent', value: 'rent', icon: 'i-ph-buildings', slot: 'rent' })
  }
  return items
})

const deleteTarget = ref<{ id: string, name: string } | undefined>()
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
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-8 sm:py-10 max-w-7xl">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-buildings" class="size-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy</span>
                <UBadge color="neutral" variant="subtle" size="sm">v2</UBadge>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-highlighted leading-tight">
                All-inclusive cost calculator
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              :variant="dirty ? 'solid' : 'outline'"
              :color="dirty ? 'success' : 'neutral'"
              size="sm"
              :icon="justSaved ? 'i-ph-check' : 'i-ph-floppy-disk'"
              :disabled="!dirty"
              @click="onSave"
            >
              {{ justSaved ? 'Saved' : dirty ? 'Save' : 'Saved' }}
            </UButton>
            <UButton
              to="/compare"
              variant="outline"
              color="neutral"
              size="sm"
              icon="i-ph-scales"
              :disabled="projects.length < 2"
            >
              Compare
            </UButton>
            <UDropdownMenu
              :items="[[
                { label: 'Add project', icon: 'i-ph-plus', onSelect: () => addProject(`Project ${projects.length + 1}`) },
                { label: 'Duplicate current', icon: 'i-ph-copy', onSelect: () => duplicateProject(active.id) },
                { label: 'Export JSON', icon: 'i-ph-download-simple', onSelect: () => onExport() },
                { label: 'Import JSON', icon: 'i-ph-upload-simple', onSelect: () => fileInput?.click() },
                { label: 'Delete current', icon: 'i-ph-trash', color: 'error' as const, onSelect: () => removeProject(active.id) },
              ]]"
            >
              <UButton icon="i-ph-dots-three" variant="outline" color="neutral" size="sm" />
            </UDropdownMenu>
            <UColorModeSelect class="w-28" color="neutral" size="sm" />
            <input ref="fileInput" type="file" accept=".json" class="hidden" @change="onImport">
          </div>
        </div>

        <div class="mt-4 flex items-center gap-2 flex-wrap">
          <UFieldGroup v-for="p in projects" :key="p.id">
            <UButton
              :variant="p.id === active.id ? 'solid' : 'outline'"
              color="neutral"
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
          <UButton size="sm" variant="ghost" color="neutral" icon="i-ph-plus" @click="addProject(`Project ${projects.length + 1}`)">
            New
          </UButton>
        </div>
        <USeparator class="mt-5" />
      </header>

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

      <div class="grid gap-8 lg:grid-cols-[1fr_26rem] xl:grid-cols-[1fr_28rem]">
        <!-- LEFT: inputs in tabs -->
        <div>
          <UTabs
            v-model="activeTab"
            :items="tabItems"
            variant="pill"
            size="md"
            class="mb-5"
          >
            <template #basic>
              <div class="space-y-4 pt-4">
                <UFormField label="Project name" size="md">
                  <UInput v-model="active.name" class="w-full" placeholder="e.g. Rajapushpa Imperia C-2204" />
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
                  <URadioGroup
                    v-model="active.possessionStatus"
                    :items="[
                      { label: 'Under construction', value: 'underConstruction', hint: 'GST applies on flat cost' },
                      { label: 'Ready to move', value: 'readyToMove', hint: 'No GST on flat cost' },
                    ]"
                    variant="card"
                    orientation="horizontal"
                    size="sm"
                    :ui="{ fieldset: 'w-full gap-x-3', item: 'flex-1 rounded-lg px-3 py-2.5' }"
                  />
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
                <UFormField label="Builder discount / offer" size="md" hint="Percentage discount on base price">
                  <UInputNumber
                    v-model="active.discountPct"
                    :min="0"
                    :max="0.9"
                    :step="0.005"
                    :increment="false"
                    :decrement="false"
                    disable-wheel-change
                    :formatOptions="{ maximumFractionDigits: 3 }"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </template>

            <template #builder>
              <div class="pt-4">
                <ChargeSection
                  :project="active"
                  title="Builder / project charges"
                  icon="i-ph-wrench"
                  :items="itemsFor(active, 'builder')"
                />
              </div>
            </template>

            <template #government>
              <div class="pt-4">
                <ChargeSection
                  :project="active"
                  title="Government charges"
                  icon="i-ph-bank"
                  :items="itemsFor(active, 'government')"
                />
              </div>
            </template>

            <template #possession>
              <div class="pt-4">
                <ChargeSection
                  :project="active"
                  title="Possession / initial charges"
                  icon="i-ph-key"
                  :items="itemsFor(active, 'possession')"
                />
              </div>
            </template>

            <template #loan>
              <div class="pt-4">
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
            </template>

            <template #interiors>
              <div class="pt-4">
                <section class="rounded-lg border border-default p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <UIcon name="i-ph-paint-brush" class="size-4 text-muted" />
                    <h4 class="text-sm font-semibold flex-1">Interiors / move-in budget</h4>
                  </div>
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
                </section>
              </div>
            </template>

            <template #rent>
              <div class="pt-4">
                <section class="rounded-lg border border-default p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <UIcon name="i-ph-buildings" class="size-4 text-muted" />
                    <h4 class="text-sm font-semibold flex-1">Rent during construction</h4>
                  </div>
                  <div class="space-y-4">
                    <UFormField label="Monthly rent" size="md">
                      <div class="relative">
                        <UInputNumber
                          v-model="active.rentDuringConstruction"
                          :min="0"
                          :step="1000"
                          :increment="false"
                          :decrement="false"
                          disable-wheel-change
                          :formatOptions="{ maximumFractionDigits: 0 }"
                          class="w-full"
                        />
                        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">₹ / month</span>
                      </div>
                    </UFormField>
                    <div class="grid grid-cols-2 gap-4">
                      <UFormField label="Expected handover" size="md">
                        <UInputDate
                          :model-value="handoverCalendarDate"
                          granularity="day"
                          class="w-full"
                          @update:model-value="onHandoverChange"
                        />
                      </UFormField>
                      <UFormField label="Rent escalation / year" size="md">
                        <UInputNumber
                          v-model="active.rentEscalationPct"
                          :min="0"
                          :max="0.5"
                          :step="0.01"
                          :increment="false"
                          :decrement="false"
                          disable-wheel-change
                          :formatOptions="{ maximumFractionDigits: 2 }"
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                  </div>
                  <div class="text-xs text-muted mt-2">
                    Rent you keep paying until the flat is ready — excluded from the flat price, shown in the summary.
                  </div>
                </section>
              </div>
            </template>
          </UTabs>
        </div>

        <!-- RIGHT: summary -->
        <div class="lg:sticky lg:top-8 self-start w-full">
          <SummaryCard :project="active" />
        </div>
      </div>
    </UContainer>
  </div>
</template>