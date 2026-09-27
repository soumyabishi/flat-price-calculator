<script setup lang="ts">
/**
 * Explains one of the summary's headline totals: what question it answers and
 * exactly what is inside and outside it.
 *
 * The whole point of the app is that "total" is ambiguous, so each figure says
 * what it swallows and what it deliberately leaves out. Screen-only: the PDF is
 * the document, and these affordances are not part of it.
 */
defineProps<{
  label: string
  answers: string
  includes: string[]
  excludes?: string[]
  footnote?: string
}>()
</script>

<template>
  <UPopover :content="{ align: 'start', side: 'bottom' }" :arrow="true">
    <button
      type="button"
      class="print:hidden -mt-0.5 ml-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full align-middle text-muted transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      :aria-label="`What does ${label} include?`"
    >
      <UIcon name="i-ph-info" class="size-3.5" />
    </button>

    <template #content>
      <div class="w-72 max-w-[80vw] space-y-2.5 p-1 sm:w-80">
        <div class="text-[11px] font-semibold uppercase tracking-widest text-primary">
          {{ label }}
        </div>
        <p class="text-sm leading-snug text-default">
          {{ answers }}
        </p>

        <div class="space-y-1">
          <div class="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Includes
          </div>
          <ul class="space-y-0.5 text-xs leading-snug text-dimmed">
            <li v-for="item in includes" :key="item" class="flex gap-1.5">
              <span class="text-primary" aria-hidden="true">+</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div v-if="excludes?.length" class="space-y-1">
          <div class="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Excludes
          </div>
          <ul class="space-y-0.5 text-xs leading-snug text-dimmed">
            <li v-for="item in excludes" :key="item" class="flex gap-1.5">
              <span class="text-muted" aria-hidden="true">−</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <p v-if="footnote" class="border-t border-default pt-2 text-[11px] leading-snug text-muted">
          {{ footnote }}
        </p>
      </div>
    </template>
  </UPopover>
</template>
