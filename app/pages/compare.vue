<script setup lang="ts">
import { formatINR } from '~/composables/computeProject'
import { computeProject } from '~/composables/computeProject'

useHead({ title: 'FlatBuy — Compare projects' })

const {
  projects,
  activeId,
} = useProjects()

const baselineId = ref('')

onMounted(() => {
  if (!baselineId.value) baselineId.value = activeId.value || projects.value[0]?.id || ''
})

const results = computed(() =>
  Object.fromEntries(projects.value.map(p => [p.id, computeProject(p)])),
)

function res(id: string) {
  return results.value[id]
}

function allItemIds(sectionKey: string) {
  const ids = new Set<string>()
  for (const p of projects.value) {
    const sec = res(p.id)?.sections.find((s: { key: string }) => s.key === sectionKey)
    for (const ci of sec?.items ?? []) ids.add(ci.item.id)
  }
  return [...ids]
}

function itemLabel(sectionKey: string, itemId: string) {
  for (const p of projects.value) {
    const ci = res(p.id)?.sections.find((s: { key: string }) => s.key === sectionKey)?.items.find((i: { item: { id: string } }) => i.item.id === itemId)
    if (ci) return ci.item.label
  }
  return itemId
}

function itemTotal(projectId: string, sectionKey: string, itemId: string) {
  return res(projectId)?.sections.find((s: { key: string }) => s.key === sectionKey)?.items.find((i: { item: { id: string } }) => i.item.id === itemId)?.total
}
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-8 max-w-none px-6 sm:px-10">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-scales" class="size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy</span>
              <h1 class="text-2xl sm:text-3xl font-bold text-highlighted leading-tight">
                Compare projects
              </h1>
            </div>
          </div>
          <UButton to="/" variant="outline" color="neutral" size="sm" icon="i-ph-arrow-left">
            Calculator
          </UButton>
        </div>
        <p class="mt-2 text-sm text-muted">
          Click a project name to set it as the comparison baseline.
        </p>
        <USeparator class="mt-5" />
      </header>

      <div class="w-full">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-default">
              <th class="py-3 text-left font-medium text-muted min-w-40">Project</th>
              <th
                v-for="p in projects"
                :key="p.id"
                class="py-3 text-right px-4"
              >
                <button
                  class="hover:text-highlighted transition-colors text-base"
                  :class="p.id === baselineId ? 'text-primary font-bold' : 'font-semibold'"
                  @click="baselineId = p.id"
                >
                  {{ p.name }}
                  <span v-if="p.id === baselineId" class="text-[10px] ml-1 align-top">(baseline)</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-default">
              <td class="py-3 font-semibold">Grand total</td>
              <td v-for="p in projects" :key="p.id" class="py-3 text-right px-4 tabular-num text-lg font-bold">
                {{ formatINR(res(p.id)?.grandTotal ?? 0) }}
              </td>
            </tr>
            <tr class="border-b border-default">
              <td class="py-2 text-muted">All-inclusive / sq.ft.</td>
              <td v-for="p in projects" :key="p.id" class="py-2 text-right px-4 tabular-num text-muted">
                ₹{{ (res(p.id)?.perSqft ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }) }}
              </td>
            </tr>
            <tr class="border-b border-default">
              <td class="py-2 text-muted">Net flat cost</td>
              <td v-for="p in projects" :key="p.id" class="py-2 text-right px-4 tabular-num">
                {{ formatINR(res(p.id)?.netFlatCost ?? 0) }}
              </td>
            </tr>
            <tr class="border-b border-default">
              <td class="py-2 text-muted">Sale consideration (incl. GST)</td>
              <td v-for="p in projects" :key="p.id" class="py-2 text-right px-4 tabular-num">
                {{ formatINR((res(p.id)?.saleConsideration ?? 0) + (res(p.id)?.sections.find((s: { key: string }) => s.key === 'builder')?.items.find((i: { item: { id: string } }) => i.item.id === 'base-gst')?.total ?? 0)) }}
              </td>
            </tr>
            <tr class="border-b border-default bg-elevated/30">
              <td class="py-2 font-medium">vs baseline</td>
              <td v-for="p in projects" :key="p.id" class="py-2 text-right px-4 tabular-num font-medium">
                <template v-if="p.id === baselineId">—</template>
                <template v-else>
                  <span :class="(res(p.id)?.grandTotal ?? 0) - (res(baselineId)?.grandTotal ?? 0) > 0 ? 'text-error' : 'text-success'">
                    {{ (res(p.id)?.grandTotal ?? 0) - (res(baselineId)?.grandTotal ?? 0) > 0 ? '+' : '' }}{{ formatINR((res(p.id)?.grandTotal ?? 0) - (res(baselineId)?.grandTotal ?? 0)) }}
                  </span>
                </template>
              </td>
            </tr>

            <template v-for="sectionKey in ['builder', 'government', 'possession']" :key="sectionKey">
              <tr class="border-b border-default">
                <td class="pt-5 pb-1 font-semibold text-xs uppercase tracking-wide text-muted" colspan="1">
                  {{ sectionKey === 'builder' ? 'Builder charges' : sectionKey === 'government' ? 'Government charges' : 'Possession charges' }}
                </td>
                <td v-for="p in projects" :key="p.id" />
              </tr>
              <tr
                v-for="itemId in allItemIds(sectionKey)"
                :key="itemId"
                class="border-b border-default/40"
              >
                <td class="py-1.5 text-muted">{{ itemLabel(sectionKey, itemId) }}</td>
                <td v-for="p in projects" :key="p.id" class="py-1.5 text-right px-4 tabular-num">
                  <template v-if="itemTotal(p.id, sectionKey, itemId) !== undefined">
                    {{ formatINR(itemTotal(p.id, sectionKey, itemId)!) }}
                  </template>
                  <span v-else class="text-dimmed">—</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </UContainer>
  </div>
</template>