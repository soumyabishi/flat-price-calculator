<script setup lang="ts">
useHead({
  title: 'FlatBuy — Home Buying Guide',
  meta: [
    { name: 'description', content: 'Home buying guides, checklists and money-saving tips for Indian new-flat buyers — curated from Pulse Insights by Buy Right.' },
  ],
})

type Post = { url: string, title: string }
type Category = { id: string, label: string, icon: string, blurb: string, posts: Post[] }

const categories: Category[] = [
  {
    id: 'buying-guides',
    label: 'Buying Guides',
    icon: 'i-ph-book-open-text',
    blurb: 'Start here — the end-to-end view of what buying a new flat actually involves, from shortlisting to registration.',
    posts: [
      { url: 'https://www.instagram.com/p/DRrL0Hokno0/', title: 'The complete buying guide' },
      { url: 'https://www.instagram.com/p/DSfn8ZNEke_/', title: 'Steps in the buying process' },
      { url: 'https://www.instagram.com/p/DUNhB1lkrmw/', title: 'What to verify before you book' },
      { url: 'https://www.instagram.com/p/DRp8OzrE4PJ/', title: 'Reading a builder price sheet' },
      { url: 'https://www.instagram.com/p/DSFsc-OkiVh/', title: 'Costs beyond the base price' },
    ],
  },
  {
    id: 'unit-selection',
    label: 'Unit Selection & Views',
    icon: 'i-ph-buildings',
    blurb: 'Which unit to pick inside a tower — floor, facing, view, and the premiums attached to each.',
    posts: [
      { url: 'https://www.instagram.com/p/DSX0lNKEgho/', title: 'How to pick the right unit' },
      { url: 'https://www.instagram.com/p/DSLTZduk3vJ/', title: 'Floor selection: what matters' },
      { url: 'https://www.instagram.com/p/DRqZ6DDkgHD/', title: 'East vs West vs North facing' },
      { url: 'https://www.instagram.com/p/DR6joedkoGV/', title: 'View premiums: worth it?' },
      { url: 'https://www.instagram.com/p/DRv3ImuErZJ/', title: 'Units to avoid' },
      { url: 'https://www.instagram.com/p/DRts6XhEsVK/', title: 'Corner vs middle units' },
    ],
  },
  {
    id: 'rent-vs-buy',
    label: 'Rent vs Buy',
    icon: 'i-ph-scales',
    blurb: 'The honest math of renting vs buying — including the rent you save while the flat is under construction.',
    posts: [
      { url: 'https://www.instagram.com/p/DTujFmNkgUf/', title: 'Rent vs buy: the framework' },
      { url: 'https://www.instagram.com/p/DTs4CqoEjjC/', title: 'When renting wins' },
    ],
  },
  {
    id: 'fomo',
    label: 'FOMO',
    icon: 'i-ph-lightning',
    blurb: 'Sales pressure is a feature of real estate, not a bug. How to see through "only 2 units left" tactics.',
    posts: [
      { url: 'https://www.instagram.com/p/DTNdc9YklwE/', title: 'The FOMO playbook builders use' },
      { url: 'https://www.instagram.com/p/DTKez7_EqFC/', title: 'Why waiting a month is rarely fatal' },
    ],
  },
  {
    id: 'wait-vs-buy',
    label: 'Wait vs Buy Now Analysis',
    icon: 'i-ph-hourglass',
    blurb: 'Should you buy now or wait? Price trends, rate cycles and the real cost of waiting.',
    posts: [
      { url: 'https://www.instagram.com/p/DULbVLwEuoA/', title: 'Buy now or wait?' },
      { url: 'https://www.instagram.com/p/DRxAEZjEktb/', title: 'What happens if prices correct' },
      { url: 'https://www.instagram.com/p/DSPgQqUEw87/', title: 'Interest rate cycles and timing' },
    ],
  },
  {
    id: 'ev-ready',
    label: 'EV Ready Homes',
    icon: 'i-ph-car-battery',
    blurb: 'EV charging is becoming a deal-breaker for resale. What "EV ready" should actually mean.',
    posts: [
      { url: 'https://www.instagram.com/p/DUIkx4PkmvR/', title: 'EV-ready homes explained' },
    ],
  },
  {
    id: 'loan',
    label: 'Loan & Savings',
    icon: 'i-ph-percent',
    blurb: 'Down payment, EMI, interest burden — the loan side of the purchase that most calculators skip.',
    posts: [
      { url: 'https://www.instagram.com/p/DRyBHvukkJq/', title: 'Structuring the down payment' },
      { url: 'https://www.instagram.com/p/DRqBV13krZo/', title: 'Loan eligibility basics' },
      { url: 'https://www.instagram.com/p/DR4Bi6KEp1R/', title: 'Interest outgo: total picture' },
    ],
  },
  {
    id: 'luxury',
    label: 'All about Luxury',
    icon: 'i-ph-diamond',
    blurb: 'What premium projects actually deliver beyond the brochure — and what you pay for it.',
    posts: [
      { url: 'https://www.instagram.com/reel/DS6tancE6L2/', title: 'Is "luxury" worth the premium?' },
      { url: 'https://www.instagram.com/p/DSjxg9RErVE/', title: 'Luxury amenities: real vs marketing' },
      { url: 'https://www.instagram.com/p/DRumPzeElgz/', title: 'The maintenance cost of luxury' },
      { url: 'https://www.instagram.com/p/DRteILWktLI/', title: 'What to expect from premium builds' },
    ],
  },
  {
    id: 'health',
    label: 'Health & Pollution Checklists',
    icon: 'i-ph-heart',
    blurb: 'Site-level factors that affect daily life: air quality, noise, water, and how to check them before booking.',
    posts: [
      { url: 'https://www.instagram.com/reel/DTAFhP3kttq/', title: 'Checking pollution at the site' },
      { url: 'https://www.instagram.com/p/DRp-cH3E-tK/', title: 'Health checklist for site visits' },
      { url: 'https://www.instagram.com/p/DRs9O_gkr5q/', title: 'Water quality and supply' },
      { url: 'https://www.instagram.com/p/DR88ZVvkjCu/', title: 'Noise sites: roads, rails, flight paths' },
    ],
  },
  {
    id: 'money-saving',
    label: 'Money Saving Tips',
    icon: 'i-ph-piggy-bank',
    blurb: 'Where buyers overpay — negotiated charges, timing, and line items that are worth questioning.',
    posts: [
      { url: 'https://www.instagram.com/reel/DTAiyWjEpTQ/', title: 'Negotiating with builders' },
      { url: 'https://www.instagram.com/p/DR4wFMVkmtH/', title: 'Charges you can question' },
      { url: 'https://www.instagram.com/p/DR4LRZiEvQG/', title: 'Payment plan tricks that cost you' },
    ],
  },
  {
    id: 'terms',
    label: 'Real Estate Terms',
    icon: 'i-ph-book-bookmark',
    blurb: 'Carpet vs super built-up, OC/CC, RERA, khata — decode the jargon in plain language.',
    posts: [
      { url: 'https://www.instagram.com/reel/DS5roNgk8ux/', title: 'Terms in one reel' },
      { url: 'https://www.instagram.com/p/DRqHxo2knaa/', title: 'Carpet vs built-up vs super built-up' },
      { url: 'https://www.instagram.com/p/DRqPVGJEiBh/', title: 'OC, CC and khata explained' },
      { url: 'https://www.instagram.com/p/DSdVdSAk9hO/', title: 'RERA and what it covers' },
    ],
  },
  {
    id: 'buying-options',
    label: 'All Buying Options',
    icon: 'i-ph-list-checks',
    blurb: 'Direct-from-builder, resale, and secondary market routes — the trade-offs of each.',
    posts: [
      { url: 'https://www.instagram.com/p/DRqEi4DEiHV/', title: 'Every way to buy a flat' },
      { url: 'https://www.instagram.com/p/DRrBYYNEgej/', title: 'Direct vs resale vs assignment' },
      { url: 'https://www.instagram.com/p/DSgs5Cckjve/', title: 'Buying in early-stage launches' },
      { url: 'https://www.instagram.com/p/DRqGBqEkkFO/', title: 'Pre-launch risks' },
      { url: 'https://www.instagram.com/p/DRqCqycEt6P/', title: 'Group buying' },
      { url: 'https://www.instagram.com/p/DRp_39kE33d/', title: 'Which route fits you' },
    ],
  },
  {
    id: 'due-diligence',
    label: 'Need for Due Diligence',
    icon: 'i-ph-magnifying-glass',
    blurb: 'The one step that protects everything else — verifying what the builder claims.',
    posts: [
      { url: 'https://www.instagram.com/p/DR6bhWKktZ6/', title: 'Why due diligence matters' },
    ],
  },
  {
    id: 'checklists',
    label: 'Checklists & Traps',
    icon: 'i-ph-clipboard-text',
    blurb: 'Practical checklists and the classic traps first-time buyers fall into.',
    posts: [
      { url: 'https://www.instagram.com/p/DRqXbBNkg_N/', title: 'The booking checklist' },
      { url: 'https://www.instagram.com/p/DRq8eI2Eo02/', title: 'Builder agreement traps' },
      { url: 'https://www.instagram.com/p/DRrlUDOkvvb/', title: 'Payment schedule traps' },
      { url: 'https://www.instagram.com/p/DRq_1lIknnm/', title: 'Possession-day surprises' },
      { url: 'https://www.instagram.com/p/DRtJEqrEgqR/', title: 'Cam charges at handover' },
      { url: 'https://www.instagram.com/p/DRqKa05kvaY/', title: 'Car park legal traps' },
      { url: 'https://www.instagram.com/p/DSMwGfHEp2z/', title: 'Common clause traps' },
      { url: 'https://www.instagram.com/p/DR62cPTE8Lc/', title: 'Red flags in the brochure' },
    ],
  },
]

const openId = ref<string | null>(null)
function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
function embedSrc(url: string) {
  const path = url.replace('https://www.instagram.com', '')
  return `https://www.instagram.com${path}embed`
}
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UContainer class="py-6 sm:py-8 max-w-5xl px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-11 rounded-xl bg-primary text-inverted shrink-0">
              <UIcon name="i-ph-book-open-text" class="size-6" />
            </div>
            <div>
              <span class="text-sm font-semibold tracking-wide text-muted uppercase">FlatBuy</span>
              <h1 class="text-xl sm:text-3xl font-bold text-highlighted leading-tight">
                Home Buying Guide
              </h1>
            </div>
          </div>
          <UButton to="/" variant="outline" color="neutral" icon="i-ph-calculator" size="sm">
            Calculator
          </UButton>
        </div>
        <p class="mt-3 text-sm text-muted max-w-2xl">
          Tricks, checklists and traps for new-flat buyers in India — each topic opens an
          explainer you can read right here. Curated from
          <a
            href="https://www.instagram.com/pulse.buyright"
            target="_blank"
            rel="noopener"
            class="text-primary hover:underline"
          >Pulse Insights by Buy Right</a>
          (unaffiliated, no bias or listings).
        </p>
      </header>

      <div class="space-y-3">
        <section
          v-for="cat in categories"
          :key="cat.id"
          class="rounded-xl border border-default overflow-hidden"
        >
          <button
            class="w-full flex items-center gap-3 p-4 text-left hover:bg-elevated/50 transition-colors"
            :aria-expanded="openId === cat.id"
            @click="toggle(cat.id)"
          >
            <UIcon :name="cat.icon" class="size-5 shrink-0 text-primary" />
            <div class="min-w-0 flex-1">
              <h2 class="font-semibold text-highlighted">{{ cat.label }}</h2>
              <p class="text-xs text-muted mt-0.5">{{ cat.blurb }}</p>
            </div>
            <UBadge color="neutral" variant="soft" size="sm">{{ cat.posts.length }}</UBadge>
            <UIcon
              :name="openId === cat.id ? 'i-ph-caret-up' : 'i-ph-caret-down'"
              class="size-4 shrink-0 text-muted"
            />
          </button>

          <div v-if="openId === cat.id" class="px-4 pb-4 grid gap-4 sm:grid-cols-2">
            <ClientOnly>
              <iframe
                v-for="post in cat.posts"
                :key="post.url"
                :src="embedSrc(post.url)"
                width="328"
                height="560"
                frameborder="0"
                scrolling="no"
                allowtransparency="true"
                class="w-full max-w-[328px] rounded-lg border border-default justify-self-center"
                :title="post.title"
                loading="lazy"
              />
              <template #fallback>
                <a
                  v-for="post in cat.posts"
                  :key="post.url"
                  :href="post.url"
                  target="_blank"
                  rel="noopener"
                  class="text-xs text-primary hover:underline"
                >{{ post.title }} — open on Instagram</a>
              </template>
            </ClientOnly>
          </div>
        </section>
      </div>

      <footer class="mt-10 text-center text-xs text-muted">
        Guides by
        <a href="https://www.instagram.com/pulse.buyright" target="_blank" rel="noopener" class="text-primary hover:underline">Pulse Insights by Buy Right</a>
        · Embedded for educational reference ·
        <NuxtLink to="/" class="text-primary hover:underline">Back to the calculator</NuxtLink>
      </footer>
    </UContainer>
  </div>
</template>