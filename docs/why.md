# Why we built FlatBuy

## The problem

A flat does not cost what the brochure says it costs.

Builders advertise a rate per sq.ft. That number is real, and it is also incomplete. It is a *starting* figure, not a price. It sits on top of a stack of things the buyer is nonetheless going to pay:

- GST on the flat and on many project charges
- Stamp duty, registration fee, transfer duty
- PLC, floor-rise, parking, clubhouse and infrastructure charges
- Advance maintenance, corpus, society formation, utility and maintenance deposits
- Interiors, if you are not taking the builder's unfinished shell

None of these are hidden in the sense of being deliberately concealed. They are *disaggregated* — they live in a separate price sheet, a separate clause, or a verbal assurance at the sales desk. The consequence is not fraud. It is that **nobody, including the buyer's own family, adds them up before signing.** The arithmetic gets done late, usually by the bank, and the gap between the advertised rate and the number that actually leaves the account is discovered in instalments rather than in advance.

Two things make this worse than a spreadsheet problem.

**"Total" is undefined.** When a buyer says a flat costs ₹1.4 Cr, they might mean the advertised rate, the agreement value, the value with GST, the value including registration, the value including interiors, or the value including two years of rent while it is built. All six are defensible. All six are in circulation. So two people comparing two flats can be quoting different numbers, both honestly, and neither can prove the other is wrong. The comparison collapses into an argument about definitions instead of a decision about flats.

**Under construction, the price is not the problem — the overlap is.** For the entire build period a buyer typically pays an EMI *and* current rent *and* maintenance, for a flat that is not yet habitable. This is the single largest number in the household's life and almost nobody models it, because it lives in three unrelated places: a bank sanction letter, a rental agreement, and a society estimate.

## What we built

One calculator that answers three questions, in the buyer's own numbers, from the buyer's own quote sheet.

1. **What does the flat really cost?**
2. **What do I need to actually move in?**
3. **What does it cost me to get from today to living there?**

Each has a precise definition, a label, and a derivation from the same underlying line items. There is no fourth interpretation, and the three are shown stacked so the reader can see how each one is built from the last.

## The three numbers

| | All-inclusive | Move-in cost | Total cash impact |
|---|---|---|---|
| **Answers** | What the flat costs | What I need to move in | What it costs to get there |
| **=** | net flat cost + builder + government + possession | all-inclusive + interiors | move-in + rent during construction |
| **Includes** | GST, stamp duty, registration, transfer duty, PLC, floor-rise, parking, clubhouse, infrastructure, advance maintenance, corpus, society formation, utility & maintenance deposits | the same, plus your interiors budget | the same, plus rent to handover with yearly escalation |
| **Excludes** | TDS, interiors, rent | rent | — |
| **Per sq.ft.** | shown, so two projects can be compared on the real number | — | — |

We keep these separate on purpose. Collapsing them into one "total" is exactly the ambiguity the tool exists to remove. A buyer comparing projects needs the first. A buyer checking their bank balance needs the second. A buyer deciding whether to wait needs the third. Different questions, different numbers — so we show all three and state what each contains.

## Decisions worth defending

**TDS is excluded from the total.** 1% under section 194-IA is money you pay to the government that comes back to you as a credit against what you owe the builder. It is a payment *routing* decision, not an extra cost. Including it inflates the price by a lakh and misleads. It is still shown, clearly labelled, because you do need to write the cheque for it.

**Rent is excluded from the price, and added to cash impact.** Rent you pay while waiting is not part of what you own. But it is very much part of what you spend, so it belongs in the affordability question and nowhere else.

**No handover date means an estimate, and it is labelled as one.** We assume an 18-month build rather than showing a blank, but the line reads "assuming 18" so nobody mistakes an assumption for a quote.

**Percentage charges anchor to the net flat cost, not the gross.** Stamp duty and registration are computed on the post-discount figure, which is how builders actually calculate them. Anchoring to gross would overstate them.

## What it deliberately does not do

- **No state presets.** Rates differ by state and change; we would rather you enter the numbers from your sheet than trust a default that was correct when we wrote it.
- **No loan amortisation yet.** Loan amount, rate and tenure are captured and saved, and the summary shows them — but EMI and total interest are not computed. That is the next thing to build, and the document says so rather than implying a number it does not have.
- **No backend.** Projects live in your browser and export to JSON. Your rate sheets and floor plans are nobody's business.
- **No resale.** A resale flat has genuinely different tax treatment (no GST, buyer-only stamp duty). Pretending one calculator covers both would be wrong in a way that costs someone money.

## Who this is for

You are holding a builder's price sheet, you have a number in your head, and you want to know whether it is true — before you commit, not after. You may also be holding a second sheet from a different project and want to know which one is actually cheaper, on a like-for-like basis.

## What success looks like

- Every number on a real quote sheet can be entered, and the result reconciles with the builder's own working.
- Two projects compared on true all-inclusive cost per sq.ft., not on advertised rate.
- The number you take into the bank, or into the sales conversation, is the number in this app.
- Nothing in the summary is a claim we cannot derive from the inputs on screen.
