<script setup lang="ts">
/**
 * The short "why" behind the summary. Kept deliberately brief: the per-total
 * ⓘ popovers carry the detail (what is in, what is out, and why), so this only
 * has to make the case for why three totals exist at all.
 */
const open = ref(false)
</script>

<template>
  <UButton
    variant="link"
    color="neutral"
    size="sm"
    class="print:hidden !px-0 align-baseline"
    @click="open = true"
  >
    <UIcon name="i-ph-question" class="size-3.5" />
    <span class="text-xs">Why these numbers?</span>
  </UButton>

  <UModal
    :open="open"
    :overlay="true"
    :ui="{ content: 'sm:max-w-xl' }"
    @update:open="open = $event"
  >
    <template #content>
      <div class="max-h-[85vh] space-y-4 overflow-y-auto p-5 sm:p-6">
        <h3 class="text-base font-semibold text-highlighted">Why three totals?</h3>

        <p class="text-sm leading-relaxed text-default">
          A builder’s rate is a starting point, not a price. GST, stamp duty, registration, PLC,
          parking and maintenance are all real — they just sit on a different page of the price
          sheet, so they get added up late. Usually after you’ve signed.
        </p>

        <p class="text-sm leading-relaxed text-default">
          The harder problem is the word <strong>“total”</strong>. Buyers use it to mean six
          different things. So we don’t hand you one number. We give you three, and each one states
          what it contains.
        </p>

        <div class="overflow-hidden rounded-lg border border-default">
          <table class="w-full text-left text-xs">
            <thead class="bg-muted/60 text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th class="px-3 py-2 font-medium">Total</th>
                <th class="px-3 py-2 font-medium">Answers</th>
                <th class="px-3 py-2 font-medium">Is</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default/60 align-top">
              <tr>
                <td class="px-3 py-2 font-medium text-default">All-inclusive</td>
                <td class="px-3 py-2 text-dimmed">What the flat really costs</td>
                <td class="px-3 py-2 text-dimmed">Flat + builder + government + possession</td>
              </tr>
              <tr>
                <td class="px-3 py-2 font-medium text-default">Move-in cost</td>
                <td class="px-3 py-2 text-dimmed">What you need to move in</td>
                <td class="px-3 py-2 text-dimmed">All-inclusive + interiors</td>
              </tr>
              <tr>
                <td class="px-3 py-2 font-medium text-default">Total cash impact</td>
                <td class="px-3 py-2 text-dimmed">What it costs to get there</td>
                <td class="px-3 py-2 text-dimmed">Move-in cost + rent until handover</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-xs leading-relaxed text-muted">
          Tap the <UIcon name="i-ph-info" class="mx-0.5 inline size-3.5 align-[-2px]" /> on any total
          for the full breakdown. Where something’s still missing — home-loan interest, for now —
          we say so rather than guess.
        </p>
      </div>
    </template>
  </UModal>
</template>
