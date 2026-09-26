# FlatBuy Calculator v2 — Builder-Direct Flat Cost Restructure

| | |
|---|---|
| **Status** | Draft |
| **Owner** | Soumya |
| **Stakeholders** | Soumya (product + eng) |
| **Created** | 2026-09-26 |
| **Last updated** | 2026-09-26 |

## 1. Problem

The current calculator models a single fixed pricing sheet (one tower, one project): base rate + amenities/infra per sq.ft + facing premium + view premium + fixed parking. Real builder quotes don't look like this:

- Builder charges vary per project (floor rise, PLC, parking, clubhouse, infra, development, connections, legal) — the current structure can't represent most of them.
- Government charges are shown as a flat 4-line block (GST/stamp/transfer/registration) with no TDS and no notion of state-specific rates or applicability.
- Possession-side charges (advance maintenance, corpus, society formation, utility deposits) are lumped into one "handover" bucket with no flexibility.
- Buyers financing through a home loan — the majority — have no way to see down payment, EMI, interest burden, or how the all-inclusive cost maps to loan structure.
- There is no place for interiors/move-in budget, which materially affects affordability planning.

Result: users cannot reconcile the calculator with their actual builder quote, which defeats the tool's purpose.

**If we do nothing:** the calculator stays a demo of one specific project's pricing rather than a usable all-inclusive flat cost tool.

## 2. Solution

Rebuild the calculator as a 7-section, new-flat-from-builder model (proposed by Soumya). Structure:

### 1. Basic Property Details
- Built-up area (sq.ft.)
- Floor (number)
- Possession status: Under construction / Ready to move (radio, already exists)

### 2. Base Flat Price
- Rate per sq.ft
- **Base flat cost** (derived: area × rate) — shown as a read-only computed line
- Builder discount / offer (% or ₹ — keep % input from v1)
- **Net flat cost** (derived) — the anchor number for all percentage-based charges

### 3. Builder / Project Charges (optional, per project)
Each with an amount input (₹) and an on/off default; collapsed section:
- Floor-rise charges (rate per sq.ft × floors above start — keep the v1 dynamic pair)
- PLC (Preferred Location Charges)
- Car parking
- Clubhouse / amenity charges
- Infrastructure charges
- Development charges
- Electricity connection
- Water connection
- Legal/documentation charges (moves here from "handover"; its 18% GST sub-row stays)
- Other builder charges

### 4. Government Charges (state-specific rates)
- GST — % of (net flat cost + builder charges); only for under-construction; keep the existing toggle behavior
- Stamp duty — % of net flat cost
- Registration fee — % of net flat cost (capped at ₹30,000 in many states — TBD whether to cap)
- Transfer duty / surcharge / cess — % of net flat cost
- **TDS (1% u/s 194-IA)** — shown separately, labeled as a deduction mechanism, excluded from the purchase grand total (shown as its own line: "payable to govt, deductible from amount paid to builder")

### 5. Possession / Initial Charges (optional)
- Advance maintenance (₹/sq.ft × months, keep the v1 period selector)
- Corpus / sinking fund (₹/sq.ft or flat ₹)
- Society/association formation charges (flat ₹)
- Maintenance deposit (flat ₹)
- Utility deposits (electricity + water, flat ₹)
- Other possession charges (flat ₹)

### 6. Home Loan (optional section)
Inputs: down payment, loan amount (auto = total cost − down payment, editable), interest rate, tenure (years), processing fee (% or ₹).
Computed: monthly EMI, total interest, total payable (principal + interest).
- Grand total stays "property + charges" — loan costs shown as a separate summary strip ("with loan: ₹X over Y years, interest ₹Z")
- **EMI computation deferred** — for now, display the inputs and a static "EMI" readout placeholder (TBD); no amortization math in this iteration. The EMI/interest calculations land in a fast-follow.

### 7. Interior / Move-in (optional)
- Single ₹ input ("Interiors / move-in budget"), included in grand total

### Engine changes
- The formula-driven line-item engine (`useCalculatorConfig` + `computeBreakdown`) stays; sections become config groups with `optional: true` and per-item `enabled` flags
- **Charge catalog + projects (from real price-sheet analysis: Cloudswood Skye, Rajapushpa Imperia, GHR Callisto, Anvita IVANA)**
  - Master catalog of ~20 semantic charge types; a **project** = named cloned set of line items with edited values
  - Any missing charge addable as a custom item — nothing hardcoded
  - Per-item `chargeBasis`: `perSqft`, `perFloor`, `flat`, `perUnit` (e.g. parking count × rate)
  - **Per-item GST applicability** (`gstApplicable` + rate) — sheets differ (GST waived on OC, GST only on legal+CAM, GST on all instalments); renders as the ↳ arrow sub-row
  - **TDS 1%** confirmed in 3 of 4 sheets — buyer duty, excluded from grand total, shown as separate informational line
- New formula type: `loan` (inputs-only block, EMI deferred) computed outside the cost line items
- TDS item gets `excludedFromTotal: true`

### Comparison mode (new)
- Save multiple projects (each = full independent line-item set) to localStorage; export/import as JSON
- Compare view: N projects side by side — grand total + all-inclusive ₹/sq.ft normalized, category subtotals, per-item deltas vs the selected baseline project

### Out of scope
- Resale property flows (stamp duty as buyer's only cost, no GST — different rules)
- State auto-detection of rates (user edits rates manually; a state preset dropdown is a fast-follow)
- Pre-EMI calculation for construction-linked disbursement plans (show a static "Pre-EMI, if applicable" note input instead)
- Rental yield / investment angle
- EMI/amortization computation (deferred to fast-follow; inputs-only this iteration)
- Backend/server storage — projects live in localStorage + JSON export/import

## 3. Expected Outcome

- A user holding any builder quote sheet can enter every number from it and see the true all-inclusive cost, EMI, and cash-flow split, in under 3 minutes.
- **Success metrics**
  - All line items from a sample Gurgaon/Bangalore builder quote are representable (manual test with 2 real quotes)
  - Grand total = sum of all enabled items, verified against the existing Excel sheet for the default project (v1 parity)
  - Loan section accepts inputs and persists them correctly (EMI math is out of scope for this iteration)
  - Each of the 4 analyzed sheets (Skye, Imperia, Callisto, IVANA) reproduces its Lumpsum Sale Consideration / Grand Total exactly
  - Compare view shows 2+ projects side by side with per-sqft normalized totals
- Timeframe: single rebuild PR, shipped immediately after approval.

## 4. Actual Output (post-shipping)

> Filled in after release. Update the Status row to "Shipped".

- Ship date: TBD
- Measured results: TBD
- Learnings: TBD

## Risks & Assumptions

- Assumption: percentage-based charges (stamp duty etc.) anchor to **net flat cost**, not gross. Some builders quote on gross — TBD: add an anchor toggle?
- Assumption: TDS exclusion from grand total is the correct treatment for display (it is a payment-routing requirement, not an extra cost).
- Risk: builder-charge list is opinionated; wrong items could clutter. Mitigated by making every item optional/off-by-default except floor-rise (which is near-universal).
- GST applicability rules differ (affordable housing vs regular); keeping the manual GST-rate field avoids encoding policy, but a hint text should note the 1%/5% split.

## Open Questions

- Should "Base flat cost" and "Net flat cost" appear as locked rows inside the summary breakdown (like subtotals today)? Plan says yes.
- State preset dropdown (Gurgaon vs Bangalore defaults) — v1 of restructure or fast-follow?
- Down payment: should it feed a "cash required upfront" callout (down payment + stamp duty + possession charges)? Probably yes — confirm.
- Comparison storage: localStorage is per-browser; confirm JSON export/import is acceptable for sharing across devices (no backend in scope).