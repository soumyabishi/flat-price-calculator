<script setup lang="ts">
import type { Project } from '~/composables/useProjectConfig'
import { formatINR } from '~/composables/computeProject'
import { computeProject } from '~/composables/computeProject'

defineProps<{
  projects: Project[]
  /** project id to use as comparison baseline */
  baselineId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const results = computed(() => {
  return Object.fromEntries(
    useProjects().projects.value.map(p => [p.id, computeProject(p)]),
  )
})

function res(id: string) {
  return results.value[id]
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-left text-muted border-b border-default">
          <th class="py-2 font-medium min-w-36">Project</th>
          <th v-for="p in projects" :key="p.id" class="py-2 font-medium text-right">
            <button
              class="hover:text-highlighted transition-colors"
              :class="p.id === baselineId ? 'text-primary font-semibold' : ''"
              @click="emit('select', p.id)"
            >
              {{ p.name }}
              <span v-if="p.id === baselineId" class="text-[10px] ml-1">(baseline)</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-default/50">
          <td class="py-2 font-medium">Grand total</td>
          <td v-for="p in projects" :key="p.id" class="py-2 text-right tabular-num font-semibold">
            {{ formatINR(res(p.id)?.grandTotal ?? 0) }}
          </td>
        </tr>
        <tr class="border-b border-default">
          <td class="py-2 text-muted">All-inclusive / sq.ft.</td>
          <td v-for="p in projects" :key="p.id" class="py-2 text-right tabular-num text-muted">
            ₹{{ (res(p.id)?.perSqft ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }) }}
          </td>
        </tr>
        <tr class="border-b border-default">
          <td class="py-2 text-muted">Net flat cost</td>
          <td v-for="p in projects" :key="p.id" class="py-2 text-right tabular-num">
            {{ formatINR(res(p.id)?.netFlatCost ?? 0) }}
          </td>
        </tr>
        <tr class="border-b border-default">
          <td class="py-2 text-muted">vs baseline</td>
          <td v-for="p in projects" :key="p.id" class="py-2 text-right tabular-num">
            <template v-if="p.id === baselineId">—</template>
            <template v-else>
              <span :class="(res(p.id)?.grandTotal ?? 0) - (res(baselineId)?.grandTotal ?? 0) > 0 ? 'text-error' : 'text-success'">
                {{ (res(p.id)?.grandTotal ?? 0) - (res(baselineId)?.grandTotal ?? 0) > 0 ? '+' : '' }}{{ formatINR((res(p.id)?.grandTotal ?? 0) - (res(baselineId)?.grandTotal ?? 0)) }}
              </span>
            </template>
          </td>
        </tr>

        <!-- per-item rows -->
        <template v-for="sectionKey in ['builder', 'government', 'possession']" :key="sectionKey">
          <tr class="border-b border-default">
            <td colspan="1" class="pt-3 pb-1 font-semibold text-xs uppercase text-muted">
              {{ sectionKey === 'builder' ? 'Builder charges' : sectionKey === 'government' ? 'Government' : 'Possession' }}
            </td>
            <td v-for="p in projects" :key="p.id" />
          </tr>
          <tr
            v-for="item in (res(baselineId)?.sections.find(s => s.key === sectionKey)?.items ?? [])"
            :key="item.item.id"
            class="border-b border-default/50"
          >
            <td class="py-1.5 text-muted">{{ item.item.label }}</td>
            <td v-for="p in projects" :key="p.id" class="py-1.5 text-right tabular-num">
              <template v-if="res(p.id)?.sections.find(s => s.key === sectionKey)?.items.find(i => i.item.id === item.item.id)">
                {{ formatINR(res(p.id)!.sections.find(s => s.key === sectionKey)!.items.find(i => i.item.id === item.item.id)!.total) }}
              </template>
              <span v-else class="text-dimmed">—</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>