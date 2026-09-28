<script setup lang="ts">
/**
 * The short "why" behind the summary. Kept deliberately brief: the per-total
 * ⓘ popovers carry the detail (what is in, what is out, and why), so this only
 * has to make the case for why the calculator exists and why it shows four
 * numbers instead of one.
 */
const open = ref(false)

/** What a builder's number leaves out. "how" is what it does to the price. */
const LEFT_OUT = [
  { what: 'GST', how: 'usually sits on top' },
  { what: 'Stamp duty, registration and PLC', how: 'on a different page' },
  { what: 'Maintenance', how: 'quoted monthly, often only from handover' },
  { what: 'Parking', how: 'may be “subject to availability”' },
]
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
    <span class="text-xs">Why we built this</span>
  </UButton>

  <UModal
    :open="open"
    :overlay="true"
    :ui="{ content: 'sm:max-w-xl' }"
    @update:open="open = $event"
  >
    <template #content>
      <div class="max-h-[85vh] space-y-4 overflow-y-auto p-5 sm:p-6">
        <h3 class="text-base font-semibold text-highlighted">Why we built this</h3>

        <p class="text-sm leading-relaxed text-default">
          A builder quotes a rate per sq.ft., or a round number called
          <strong>“all-inclusive”</strong>. Both are real, and both leave something out:
        </p>

        <!-- Bulleted rather than run together: this is a list of separate costs,
             and burying them in a sentence is how they get missed in the first
             place. The item and what it does to your price are the two halves of
             each line, so they read as a pair. -->
        <ul class="space-y-1.5 text-sm leading-relaxed">
          <li
            v-for="item in LEFT_OUT"
            :key="item.what"
            class="flex gap-2.5"
          >
            <UIcon
              name="i-ph-minus-circle"
              class="mt-0.5 size-4 shrink-0 text-muted"
              aria-hidden="true"
            />
            <span class="min-w-0">
              <strong class="font-medium text-default">{{ item.what }}</strong>
              <span class="text-dimmed"> — {{ item.how }}</span>
            </span>
          </li>
        </ul>

        <p class="text-sm leading-relaxed text-default">
          Add it up late — usually after you’ve signed.
        </p>

        <p class="text-sm leading-relaxed text-default">
          The harder problem is the word <strong>“total”</strong>. Buyers use it to mean six
          different things. So we don’t hand you one number. The card shows all four, and each one
          states what it contains.
        </p>

        <div class="overflow-hidden rounded-lg border border-default">
          <table class="w-full text-left text-xs">
            <thead class="bg-muted/60 text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th class="px-3 py-2 font-medium">Number</th>
                <th class="px-3 py-2 font-medium">Answers</th>
                <th class="px-3 py-2 font-medium">Is</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default/60 align-top">
              <tr>
                <td class="px-3 py-2 font-medium text-default">Flat + builder</td>
                <td class="px-3 py-2 text-dimmed">What the builder quotes</td>
                <td class="px-3 py-2 text-dimmed">The agreement price, before any government charges</td>
              </tr>
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
