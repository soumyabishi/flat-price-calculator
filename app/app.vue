<script setup lang="ts">
import { formatINR } from '~/composables/computeProject'
import { CHARGE_TEMPLATES } from '~/composables/useProjectConfig'
import type { ChargeItem } from '~/composables/useProjectConfig'

useHead({ title: 'FlatBuy — All-inclusive cost calculator' })

const {
  projects,
  activeId,
  activeProject,
  addProject,
  removeProject,
  duplicateProject,
  exportJSON,
  importJSON,
} = useProjects()

const active = computed(() => activeProject.value!)

type SectionDef = {
  key: string
  title: string
  icon: string
  optional?: boolean
  open: Ref<boolean>
}

const builderOpen = ref(true)
const governmentOpen = ref(false)
const possessionOpen = ref(false)
const loanOpen = ref(false)

function itemsFor(project: { items: ChargeItem[] }, section: string): ChargeItem[] {
  return project.items.filter(i => i.section === section)
}

const fileInput = ref<HTMLInputElement | null>(null)
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

const showCompare = ref(false)
</script>

<template>
  <UApp>
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
                variant="outline"
                color="neutral"
                size="sm"
                icon="i-ph-scales"
                :disabled="projects.length < 2"
                @click="showCompare = !showCompare"
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
            <UButton
              v-for="p in projects"
              :key="p.id"
              size="sm"
              :variant="p.id === active.id ? 'solid' : 'outline'"
              color="neutral"
              @click="activeId = p.id"
            >
              {{ p.name }}
            </UButton>
            <UButton size="sm" variant="ghost" color="neutral" icon="i-ph-plus" @click="addProject(`Project ${projects.length + 1}`)">
              New
            </UButton>
          </div>
          <USeparator class="mt-5" />
        </header>

        <CompareView
          v-if="showCompare"
          :projects="projects"
          :baseline-id="active.id"
          class="mb-8"
          @select="activeId = $event"
        />

        <div class="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <!-- LEFT: inputs -->
          <div class="space-y-8">
            <!-- 1: basic details -->
            <section>
              <div class="flex items-center gap-2">
                <UIcon name="i-ph-info" class="size-5 text-muted" />
                <h2 class="text-lg font-bold">Basic details</h2>
              </div>
              <div class="mt-4 space-y-4">
                <UFormField label="Project name" size="md">
                  <UInput v-model="active.name" class="w-full" placeholder="e.g. Rajapushpa Imperia C-2204" />
                </UFormField>
                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="Built-up area" size="md">
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
                  </UFormField>
                  <UFormField label="Floor" size="md">
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
              </div>
              <USeparator class="mt-6" />
            </section>

            <!-- 2: base price -->
            <section>
              <div class="flex items-center gap-2">
                <UIcon name="i-ph-currency-inr" class="size-5 text-muted" />
                <h2 class="text-lg font-bold">Base flat price</h2>
              </div>
              <div class="mt-4 space-y-4">
                <UFormField label="Rate per sq.ft." size="md">
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
              <USeparator class="mt-6" />
            </section>

            <!-- 3-5: charge sections -->
            <ChargeSection
              :project="active"
              title="Builder / project charges"
              icon="i-ph-wrench"
              :items="itemsFor(active, 'builder')"
              collapsible
            />

            <ChargeSection
              :project="active"
              title="Government charges"
              icon="i-ph-bank"
              :items="itemsFor(active, 'government')"
            />

            <ChargeSection
              :project="active"
              title="Possession / initial charges"
              icon="i-ph-key"
              :items="itemsFor(active, 'possession')"
              collapsible
            />

            <!-- 6: loan -->
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

            <!-- 7: interiors -->
            <section class="rounded-lg border border-default p-4">
              <div class="flex items-center gap-2 mb-4">
                <UIcon name="i-ph-sofa" class="size-4 text-muted" />
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
              <div class="text-xs text-muted mt-2">One-time budget for interiors, furnishing, move-in</div>
            </section>
          </div>

          <!-- RIGHT: summary -->
          <div class="lg:sticky lg:top-8 self-start">
            <SummaryCard :project="active" />
          </div>
        </div>
      </UContainer>
    </div>
  </UApp>
</template>