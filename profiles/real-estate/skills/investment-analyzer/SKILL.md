---
name: investment-analyzer
description: "Analyze investment properties for cash flow, cap rate, cash-on-cash return, and BRRRR feasibility. Use when working with investor clients, evaluating rental potential, or positioning a property for investor buyers. Pulls rent comps and market data via Perplexity and Firecrawl. Generates a complete investment analysis with deal scorecard."
---

# Investment Analyzer Skill

> **Purpose:** Investor clients buy 3-5+ properties per year. Most agents cannot talk numbers - they can show homes but they cannot analyze deals. This skill makes any agent sound like they've run a rental portfolio. Property data, cash flow math, risk assessment, and a clear buy/pass verdict on every deal.

---

## PREREQUISITE
- **Perplexity MCP** - rent comps, vacancy rates, landlord regulations, market context
- **Firecrawl MCP** - property data scraping from Redfin/Zillow

---

## WHAT THIS SKILL DOES

- Takes an address + purchase scenario
- Pulls property data (beds, baths, sqft, year built, taxes, condition)
- Researches rental market (rent comps, vacancy rates, landlord/tenant laws)
- Runs full cash flow analysis at multiple down payment levels
- Calculates all key investment metrics (cap rate, cash-on-cash, GRM, DSCR)
- Identifies value-add opportunities (rent bumps, ADU potential, STR viability)
- Projects 5-year and 10-year hold scenarios
- Runs BRRRR analysis if rehab is involved
- Assesses risk factors specific to the jurisdiction and property
- Delivers a deal scorecard with a clear recommendation

## WHAT THIS SKILL DOES NOT DO

- Does not replace a professional appraisal or inspection
- Does not guarantee rental income or appreciation projections
- Does not provide legal or tax advice (always recommend CPA and attorney)
- Does not generate listing marketing (that's /listing-arsenal)
- Does not build follow-up sequences (that's /nurture-coach)

---

## INPUTS NEEDED

| Input | Required | Example |
|-------|----------|---------|
| Property address | Yes | "4821 Cedar Ln, Dallas TX 75214" |
| Purchase price | Yes | "$225,000" |
| Down payment | Helpful | "25%" (default: 20%) |
| Expected rent | Helpful | "$1,800/mo" (or let skill estimate) |
| Interest rate | Helpful | "7.0%" (default: current average) |
| Rehab needed | Helpful | "$15,000" (for BRRRR analysis) |
| Strategy | Helpful | "Buy and hold" or "BRRRR" or "STR" |
| Investor type | Helpful | "First-time investor" or "Has 5 doors" |

> **Minimum viable input:** Address + purchase price. The skill estimates everything else and flags assumptions.

---

## GOAL

- Primary: Give the investor client (or the agent) a clear buy/pass verdict based on real numbers
- Secondary: Make the agent look like they understand investment math - because now they do
- Tertiary: Build a data-backed investment report that the client can use to make decisions or show partners/lenders

---

## SECTION 1: CASH FLOW ANALYSIS

The core of every investment analysis. Every number must be sourced or flagged as estimated.

### Revenue
```
Gross Monthly Rent           [from comps or input]
- Vacancy Factor             [area average or 8% default]
= Effective Gross Income
```

### Expenses (Monthly)
```
Mortgage Payment (P&I)       [calculated from price, down, rate, 30yr]
Property Tax                 [from property data / 12]
Insurance                    [estimated: $1,200-2,400/yr for SFR]
Maintenance Reserve          [1% of property value / 12]
Property Management          [10% of gross rent, or $0 if self-managed]
HOA                          [from property data, or $0]
= Total Monthly Expenses
```

### Net Cash Flow
```
Effective Gross Income
- Total Monthly Expenses
= NET Monthly Cash Flow
= NET Annual Cash Flow
```

### Down Payment Scenarios
Run the analysis at three down payment levels to show the investor how leverage affects returns:
- 20% down (conventional minimum for investment)
- 25% down (standard investment property)
- 30% down (conservative / stronger cash flow)

---

## SECTION 2: KEY METRICS

Calculate all of these for every analysis:

### Cap Rate
```
Cap Rate = Net Operating Income / Purchase Price

NOI = (Annual Gross Rent x (1 - Vacancy Rate))
      - Property Tax - Insurance - Maintenance - Management

NOTE: Cap rate does NOT include mortgage. It measures
the property's return independent of financing.
```

Compare to area average cap rate. If Perplexity data is available, pull the average for the ZIP. Otherwise use these defaults:
- A-class neighborhoods: 4-6%
- B-class neighborhoods: 6-8%
- C-class neighborhoods: 8-10%
- D-class neighborhoods: 10%+ (higher risk)

### Cash-on-Cash Return
```
Cash-on-Cash = Annual Net Cash Flow / Total Cash Invested

Total Cash Invested = Down Payment + Closing Costs (est. 3%)
                      + Rehab (if any)
```

Benchmark: Most investors target 8-12% cash-on-cash. Below 6% is weak. Above 12% is strong.

### Gross Rent Multiplier (GRM)
```
GRM = Purchase Price / Annual Gross Rent

Lower is better. Under 10 is strong for most markets.
10-15 is average. Over 15 means the property is
expensive relative to rental income.
```

### Debt Service Coverage Ratio (DSCR)
```
DSCR = Net Operating Income / Annual Debt Service

Above 1.25 = Lender-friendly, strong coverage
1.0 - 1.25  = Marginal, may have trouble getting DSCR loan
Below 1.0   = Property loses money before debt service
```

### Price Per Unit
Only relevant for multi-family. Include if the property has 2+ units.
```
Price Per Unit = Purchase Price / Number of Units
```

---

## SECTION 3: RENT COMP REPORT

Pull 5-10 comparable rentals from the area to establish a realistic rent range.

### Perplexity Query:
```
perplexity_ask: "What are current rental rates for [beds]-bedroom
  [property type] homes within 1 mile of [address] in [City] [State]
  [ZIP]? Include at least 5 comparable rentals with addresses (or
  complexes), monthly rent, bedrooms, bathrooms, square footage, and
  condition (updated/dated). Also include the average vacancy rate
  for rentals in [ZIP] and any notable landlord/tenant regulations
  in [City/State]."

search_context_size: "high"
```

### If fewer than 5 comps returned, widen:
```
perplexity_ask: "Rental rates for [beds-1] to [beds+1] bedroom
  homes within 2 miles of [address] [City] [State]. List at least
  5 with monthly rent, beds, baths, sqft, and condition."

search_context_size: "high"
```

### Rent Comp Table Format:
```
┌───┬──────────────────────┬───────┬──────┬──────┬───────────┐
│ # │ Address/Complex      │ Rent  │ Bd/Ba│ Sqft │ Condition │
├───┼──────────────────────┼───────┼──────┼──────┼───────────┤
│ 1 │ 4903 Cedar Ln        │$1,850 │ 3/2  │2,100 │ Updated   │
│ 2 │ 4718 Lakeside Dr     │$1,750 │ 3/2  │1,950 │ Average   │
│ 3 │ 5012 Ridgecrest Rd   │$2,000 │ 4/2  │2,400 │ Updated   │
│ 4 │ 4655 Worth St        │$1,650 │ 3/2  │1,800 │ Dated     │
│ 5 │ 4830 Elsby Ave       │$1,900 │ 3/2  │2,200 │ Average   │
└───┴──────────────────────┴───────┴──────┴──────┴───────────┘
Average: $1,830/mo | $0.88/sqft

Recommended Rent: $1,750 - $1,900/mo
Basis: 3/2, ~2,100 sqft, average condition
```

---

## SECTION 4: VALUE-ADD OPPORTUNITIES

Evaluate each of these for every property:

### Rent Increase Potential
- Compare subject rent to top-of-market comps
- If the property is dated, estimate rent bump after cosmetic rehab
- Calculate ROI on specific improvements (new kitchen = $X cost, $Y/mo rent bump)

### ADU / Accessory Dwelling Unit
- Check lot size (typically need 5,000+ sqft for detached ADU)
- Note: zoning research requires manual verification - flag as "check with city"
- Estimate additional rental income from ADU

### Section 8 / Housing Choice Voucher
- Check HUD Fair Market Rent for the ZIP and bedroom count
- Compare to market rent - Section 8 sometimes pays above market
- Note: guaranteed rent from government, but more paperwork and inspections

### Short-Term Rental (Airbnb/VRBO)
- Research local STR regulations (many cities restrict or ban them)
- If legal, estimate nightly rate and occupancy
- Compare STR income to long-term rental income
- Flag: STR requires more management, furnishing costs, and turnover

### Unit Addition
- Only relevant if lot size and zoning allow
- Garage conversions, basement finishing, room additions
- Flag as "requires zoning verification"

---

## SECTION 5: HOLD SCENARIOS

### 5-Year Projection
```
Assumptions:
  Appreciation:    [area average or 3% default]
  Rent Growth:     [2-3% annually]
  Expense Growth:  [2% annually]
  Principal Paydown: [calculated from amortization]

Year 1:  Cash flow $X | Equity $X | Total Return $X
Year 2:  Cash flow $X | Equity $X | Total Return $X
Year 3:  Cash flow $X | Equity $X | Total Return $X
Year 4:  Cash flow $X | Equity $X | Total Return $X
Year 5:  Cash flow $X | Equity $X | Total Return $X

5-Year Summary:
  Total Cash Flow:        $X
  Equity from Paydown:    $X
  Equity from Appreciation: $X
  Total Return:           $X
  Annualized ROI:         X%
```

### 10-Year Projection
Same structure, extended to 10 years. Show cumulative totals.

### Appreciation Assumptions
Always disclose the assumption and provide a range:
- Conservative: 2% annual (below historical average)
- Moderate: 3.5% annual (near historical average)
- Optimistic: 5% annual (strong market)

Never present appreciation as guaranteed. Note: "Appreciation is speculative. Cash flow should justify the deal on its own."

---

## SECTION 6: BRRRR ANALYSIS

Only run this section if rehab is involved or the investor asks about BRRRR.

```
BRRRR BREAKDOWN

B - Buy
    Purchase Price:        $X
    Closing Costs (3%):    $X
    Total Acquisition:     $X

R - Rehab
    Rehab Budget:          $X
    Scope: [brief description]
    Timeline: [estimated weeks]
    Total Into Deal:       $X (acquisition + rehab)

R - Rent
    After-Repair Rent:     $X/mo
    Basis: [comp data post-rehab]

R - Refinance
    After-Repair Value:    $X (from comp analysis)
    Refinance at 75% LTV:  $X
    New Loan Amount:        $X
    Cash Back at Refi:      $X

R - Repeat
    Cash Left in Deal:     $X
    Cash-on-Cash (on remaining cash): X%
    Verdict: [Can repeat / Tight / Cannot repeat]
```

### BRRRR Feasibility Test
```
IF cash back at refi >= total cash invested
  -> "Full cash-out possible. Strong BRRRR candidate."

IF cash back at refi >= 80% of total cash invested
  -> "Near-full cash-out. Solid BRRRR - small amount
     left in the deal."

IF cash back at refi < 80% of total cash invested
  -> "Significant cash left in deal. BRRRR may not
     be the right strategy here. Consider buy-and-hold
     with the original financing."
```

---

## SECTION 7: RISK FACTORS

Assess each of these for every property:

### Jurisdiction Assessment
```
IF state is TX, FL, AZ, GA, IN, OH
  -> "Landlord-friendly state. Eviction process is
     relatively fast (30-60 days typical)."

IF state is CA, NY, NJ, IL, OR, WA
  -> "Tenant-friendly state. Eviction can take 3-6+
     months. Factor this into vacancy assumptions."

IF city has rent control
  -> "Rent control in effect. Annual increases capped
     at [X%]. Factor into long-term projections."
```

Research via Perplexity for specific local regulations.

### Insurance Considerations
- Flood zone? (increases insurance $1,500-3,000/yr)
- Older home? (may need specialty coverage)
- Roof age? (insurance companies increasingly refusing homes with 15+ year old roofs)

### Property Tax Trajectory
- Check if taxes are based on last sale price (will reset on purchase)
- Research annual increase caps for the jurisdiction
- Note: "Property taxes may increase significantly after purchase if currently assessed below market value"

### Neighborhood Trend
```
IF population growth + new construction + price appreciation
  -> "Improving - positive trajectory"

IF stable prices + consistent rental demand + low vacancy
  -> "Stable - reliable market"

IF price declines + rising vacancy + population loss
  -> "Declining - higher risk, factor into projections"
```

Research via Perplexity for neighborhood trend data.

---

## SECTION 8: DEAL SCORECARD

Rate each factor on a 1-10 scale. Be honest - a 4 is a 4. Do not inflate.

```
┌──────────────────────────────────────────────┐
│                                              │
│  DEAL SCORECARD                              │
│                                              │
│  Cash Flow Score:         X / 10             │
│  Appreciation Potential:  X / 10             │
│  Risk Level:              X / 10             │
│    (10 = lowest risk)                        │
│  Overall:                 X / 10             │
│                                              │
│  RECOMMENDATION:  [STRONG BUY / BUY /        │
│                    HOLD / PASS]              │
│                                              │
│  Reasoning: [2-3 sentences explaining the    │
│  verdict. Be specific. Reference the         │
│  numbers.]                                   │
│                                              │
└──────────────────────────────────────────────┘
```

### Scoring Guidelines

**Cash Flow Score:**
```
9-10:  $300+/mo net cash flow per unit
7-8:   $150-300/mo net cash flow per unit
5-6:   $50-150/mo net cash flow per unit
3-4:   Break-even to $50/mo
1-2:   Negative cash flow
```

**Appreciation Potential:**
```
9-10:  Improving neighborhood + population growth + new development
7-8:   Stable, desirable area with consistent demand
5-6:   Average market, nothing remarkable either direction
3-4:   Flat or softening market
1-2:   Declining area, population loss, rising vacancy
```

**Risk Level (10 = safest):**
```
9-10:  Landlord-friendly state, strong market, low vacancy, good condition
7-8:   Minor concerns (older property, moderate vacancy)
5-6:   Some risk (tenant-friendly laws, deferred maintenance, higher vacancy)
3-4:   Significant risk (flood zone, bad tenant laws, major repairs needed)
1-2:   High risk (declining market, structural issues, legal complications)
```

**Overall Recommendation:**
```
8-10 average:  STRONG BUY - numbers work, risk is manageable
6-7 average:   BUY - solid deal, some considerations to manage
4-5 average:   HOLD - could work but has meaningful downsides
1-3 average:   PASS - numbers do not justify the risk
```

---

## MCP USAGE

### Firecrawl - Property Data

```
CRITICAL: Two-Step URL Pattern
Never construct Redfin/Zillow URLs directly - internal IDs cause
redirects to wrong properties. Always:
1. firecrawl_search → "[full address] site:redfin.com" (find URL)
2. Verify the URL path contains the correct address
3. firecrawl_scrape → the verified URL with proxy: "stealth", waitFor: 5000
```

**Step 1 - Find Redfin URL:**
```
firecrawl_search:
  query: "[full address] site:redfin.com"
  limit: 3
```

**Step 2 - Verify the URL path contains the correct street address.**

**Step 3 - Scrape property details:**
```
firecrawl_scrape:
  url: "[verified redfin URL]"
  formats: [{
    type: "json",
    prompt: "Extract: address, bedrooms, bathrooms, sqft, year_built,
      lot_size, property_type, redfin_estimate, last_sale_date,
      last_sale_price, annual_tax, hoa_dues, heating, cooling,
      garage, price_history, tax_history, property_condition"
  }]
  proxy: "stealth"
  waitFor: 5000
```

### Perplexity - Rental Market + Regulations

**Rent comps + vacancy + regulations:**
```
perplexity_ask: "Current rental market data for [ZIP] [City] [State]:
  1. Average rent for [beds]-bedroom [property type] within 1 mile of [address]
  2. At least 5 specific rental comparables with addresses, rent, beds/baths, sqft
  3. Average vacancy rate for the area
  4. Current mortgage rates for investment properties (30-year fixed)
  5. Key landlord/tenant regulations in [City] and [State]
  6. Section 8 Fair Market Rent for [beds]-bedroom in this area
  7. Short-term rental regulations in [City] (Airbnb/VRBO allowed?)
  8. Recent rental market trend - rents rising, flat, or falling?"

search_context_size: "high"
```

**Neighborhood investment context:**
```
perplexity_ask: "Investment property analysis context for [ZIP] [City] [State]:
  1. Population trend (growing, stable, declining)
  2. Major employers in the area
  3. New development or construction projects nearby
  4. Average cap rate for rental properties in this ZIP
  5. Property tax rate and any annual increase caps
  6. Insurance considerations (flood zone, etc.)
  7. Neighborhood classification (A, B, C, D class)
  8. Year-over-year home price appreciation for this ZIP"

search_context_size: "high"
```

### Parallel Execution Plan

**Batch 1 (fire simultaneously):**
- Firecrawl search -> find Redfin URL
- Perplexity -> rent comps + vacancy + regulations
- Perplexity -> neighborhood investment context

**Batch 2 (after Redfin URL found):**
- Firecrawl scrape -> full property details

**Batch 3 (compile):**
- Merge all data sources
- Run cash flow calculations
- Calculate all metrics
- Assess value-add opportunities
- Build hold projections
- Run BRRRR analysis (if applicable)
- Score the deal
- Generate the full report

---

## DECISION LOGIC

```
IF only address + price provided
  -> Run standard buy-and-hold analysis at 20%, 25%, 30% down
  -> Estimate rent from comps
  -> Flag all estimates

IF rehab amount provided
  -> Include BRRRR analysis section
  -> Calculate after-repair value from comps
  -> Run both BRRRR and standard hold scenarios

IF strategy = "STR" or "Airbnb"
  -> Research local STR regulations first
  -> If legal: estimate nightly rate, occupancy, annual revenue
  -> Compare STR vs LTR income side by side
  -> If illegal: flag immediately, run LTR analysis only

IF investor type = "first-time"
  -> Include more explanation of metrics
  -> Flag DSCR loan requirements
  -> Note: "First-time investors should start with low-risk, positive cash flow deals"

IF property is multi-family
  -> Calculate per-unit metrics
  -> Include price per unit
  -> Analyze each unit's rent separately if data available

IF cash flow is negative
  -> Do not sugar-coat it. "This property loses $X/month at these numbers."
  -> Show what rent or purchase price would need to be for breakeven
  -> Score accordingly

IF cap rate is below area average
  -> Flag it. "Below-average cap rate for this area. You're paying a premium."
```

---

## CONSTRAINTS

- [ ] Every number must be sourced or flagged as estimated
- [ ] Never present appreciation as guaranteed - it is speculative
- [ ] Never hide negative cash flow - if it loses money, say so
- [ ] Always recommend CPA and attorney for tax and legal questions
- [ ] Follow ~/.claude/skills/client-memory/references/output-format.md for all output formatting
- [ ] Save to ./clients/ per ~/.claude/skills/client-memory/SKILL.md
- [ ] No HARD NO words from brand voice
- [ ] Mortgage calculations must use correct amortization math (not simplified)
- [ ] Cap rate calculation does NOT include mortgage (this is a common mistake)
- [ ] Property management should default to 10% even if owner-managed (shows true cost)
- [ ] Always show vacancy factor - never assume 100% occupancy
- [ ] BRRRR analysis only when rehab is involved - do not force it
- [ ] Deal scorecard must be honest - a 4 is a 4, do not inflate
- [ ] No CyclSales callout - this is a research-only skill

---

## COMPLETE EXAMPLE

### Example Input:
> Analyze 2847 Maple Ave, Dallas TX 75201 as a rental property. Purchase price $285,000. Investor wants to put 25% down. Needs about $12,000 in cosmetic updates. Interested in BRRRR.

### Example Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  INVESTMENT ANALYSIS
  2847 Maple Ave, Dallas TX 75201
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── Redfin (Firecrawl)        ✓ live
  ├── Rent comps (Perplexity)   ✓ live
  ├── Market context (Perplexity)✓ live
  └── Regulations (Perplexity)  ✓ live

  ──────────────────────────────────────────────────

  PROPERTY DETAILS

  Address:        2847 Maple Ave, Dallas TX 75201
  Type:           Single Family
  Beds / Baths:   3 / 2
  Sqft:           1,680
  Year Built:     1958
  Lot Size:       0.14 acres (6,098 sqft)
  Condition:      Dated - needs cosmetic update
  Redfin Est:     $292,000
  Annual Tax:     $5,420
  HOA:            $0
  Source: Redfin (scraped live via Firecrawl)

  ──────────────────────────────────────────────────

  RENT COMP REPORT

  ┌───┬──────────────────────┬───────┬──────┬──────┬───────────┐
  │ # │ Address              │ Rent  │ Bd/Ba│ Sqft │ Condition │
  ├───┼──────────────────────┼───────┼──────┼──────┼───────────┤
  │ 1 │ 2903 Maple Ave       │$1,950 │ 3/2  │1,720 │ Updated   │
  │ 2 │ 2714 Cedar Springs   │$1,850 │ 3/2  │1,600 │ Average   │
  │ 3 │ 3010 Routh St        │$2,100 │ 3/2  │1,850 │ Updated   │
  │ 4 │ 2655 Howell St       │$1,750 │ 3/1  │1,480 │ Dated     │
  │ 5 │ 2918 McKinney Ave    │$2,200 │ 3/2  │1,900 │ Renovated │
  │ 6 │ 2801 Thomas Ave      │$1,800 │ 3/2  │1,650 │ Average   │
  └───┴──────────────────────┴───────┴──────┴──────┴───────────┘

  Average: $1,942/mo | $1.13/sqft
  Vacancy Rate: 6.2% (75201 average)

  Recommended Rent (as-is):     $1,800/mo
  Recommended Rent (post-rehab): $1,950 - $2,050/mo
  Basis: 3/2, 1,680 sqft, cosmetic update brings
  it in line with updated comps on Maple Ave

  Source: Perplexity (live rental data)

  ──────────────────────────────────────────────────

  CASH FLOW ANALYSIS - AS-IS ($1,800/mo rent)

  Scenario: 25% Down at 7.0% / 30-year fixed

  REVENUE
  Gross Monthly Rent            $1,800
  - Vacancy (6.2%)              ($112)
  = Effective Gross Income      $1,688

  EXPENSES
  Mortgage (P&I)                ($1,422)
    Loan: $213,750 at 7.0%
  Property Tax                  ($452)
  Insurance (est.)              ($158)
  Maintenance (1% of value/yr)  ($238)
  Property Mgmt (10%)           ($180)
  HOA                           $0
  = Total Monthly Expenses      ($2,450)

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  NET MONTHLY CASH FLOW        -$762          │
  │  NET ANNUAL CASH FLOW         -$9,144        │
  │                                              │
  │  ✗  NEGATIVE CASH FLOW                      │
  │  This property loses money at current rent   │
  │  with 25% down at 7%.                        │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────

  CASH FLOW ANALYSIS - POST-REHAB ($2,000/mo rent)

  Scenario: 25% Down at 7.0% / 30-year fixed

  REVENUE
  Gross Monthly Rent            $2,000
  - Vacancy (6.2%)              ($124)
  = Effective Gross Income      $1,876

  EXPENSES
  Mortgage (P&I)                ($1,422)
  Property Tax                  ($452)
  Insurance (est.)              ($158)
  Maintenance (1% of value/yr)  ($238)
  Property Mgmt (10%)           ($200)
  HOA                           $0
  = Total Monthly Expenses      ($2,470)

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  NET MONTHLY CASH FLOW        -$594          │
  │  NET ANNUAL CASH FLOW         -$7,128        │
  │                                              │
  │  ✗  STILL NEGATIVE                          │
  │  Post-rehab rent improvement helps but       │
  │  does not get to breakeven at 7% rate.       │
  │                                              │
  └──────────────────────────────────────────────┘

  Breakeven Rent: $2,494/mo
  (Above market for this property. Not realistic.)

  ──────────────────────────────────────────────

  DOWN PAYMENT COMPARISON (post-rehab, $2,000/mo)

  ┌─────────┬──────────┬──────────┬──────────────┐
  │ Down %  │ Mortgage │ Net/Mo   │ Cash-on-Cash │
  ├─────────┼──────────┼──────────┼──────────────┤
  │ 20%     │ $1,516   │ -$688    │ -10.6%       │
  │ 25%     │ $1,422   │ -$594    │ -7.1%        │
  │ 30%     │ $1,327   │ -$500    │ -5.1%        │
  │ 50%     │ $948     │ -$121    │ -0.8%        │
  │ 100%    │ $0       │ +$826    │ +2.9%        │
  └─────────┴──────────┴──────────┴──────────────┘

  Note: Only cash purchase produces positive
  monthly cash flow at current rates. This is a
  rate problem - the property works at 5-5.5%
  rates but not at 7%.

  ──────────────────────────────────────────────────

  KEY METRICS

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  Cap Rate:              5.1%                 │
  │    Area Average:        5.8% (75201)         │
  │    Verdict:             Below average         │
  │                                              │
  │  Cash-on-Cash (25%):    -7.1%                │
  │    Target:              8-12%                 │
  │    Verdict:             Does not meet target  │
  │                                              │
  │  GRM:                   11.9                  │
  │    ($285,000 / $24,000 annual rent)          │
  │    Verdict:             Average               │
  │                                              │
  │  DSCR:                  0.76                  │
  │    ($14,424 NOI / $17,064 debt service)      │
  │    Verdict:             Below 1.0 - will not  │
  │    qualify for DSCR loan                     │
  │                                              │
  │  Price/Sqft:            $170                  │
  │    Area Average:        $185                  │
  │    Verdict:             Buying below avg $/sf │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────────

  VALUE-ADD OPPORTUNITIES

  Rent Increase Potential
  ├── Cosmetic rehab ($12K)        +$200/mo
  │   Basis: Updated 3/2s on Maple renting $1,950-2,100
  │   ROI on rehab: $2,400/yr on $12K = 20% return
  │   on the rehab spend itself
  └── Verdict: Rehab pays for itself but does not
      fix the negative cash flow at current rates

  ADU Potential
  ├── Lot size: 6,098 sqft
  ├── Dallas allows ADUs on lots 5,000+ sqft
  │   (Council approved expanded ADU rules 2024)
  ├── Estimated ADU rent: $900-1,100/mo
  ├── ADU build cost: $80,000-120,000
  └── Verdict: Possible. Would turn the deal
      cash-flow positive. Requires significant
      additional capital and 6-9 month build.

  Section 8 Viability
  ├── HUD FMR for 3-bed in Dallas: $1,821/mo
  ├── vs Market rent: $1,800-2,000
  └── Verdict: FMR is close to market. No
      meaningful advantage with Section 8 here.

  Short-Term Rental (Airbnb)
  ├── Dallas requires STR permit + $452 annual fee
  ├── Must be primary residence OR get Type 2 permit
  ├── Estimated nightly rate: $145-175
  ├── Est. occupancy: 65-70%
  ├── Est. monthly gross: $2,828-3,675
  └── Verdict: STR would produce positive cash flow
      but requires permit, furnishing ($15-20K),
      and active management. Higher risk.

  ──────────────────────────────────────────────────

  BRRRR ANALYSIS

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  B - BUY                                     │
  │  Purchase Price:         $285,000            │
  │  Closing Costs (3%):     $8,550              │
  │  Total Acquisition:      $293,550            │
  │                                              │
  │  R - REHAB                                   │
  │  Rehab Budget:           $12,000             │
  │  Scope: Cosmetic - paint, flooring, fixtures │
  │  Timeline: 3-4 weeks                         │
  │  Total Into Deal:        $305,550            │
  │                                              │
  │  Cash In (25% down + closing + rehab):       │
  │  $71,250 + $8,550 + $12,000 = $91,800       │
  │                                              │
  │  R - RENT                                    │
  │  After-Repair Rent:      $2,000/mo           │
  │  Basis: Updated 3/2 comps on Maple Ave       │
  │                                              │
  │  R - REFINANCE                               │
  │  After-Repair Value:     $305,000 (est.)     │
  │  Refinance at 75% LTV:  $228,750             │
  │  Payoff Existing Loan:   $213,750            │
  │  Cash Back at Refi:      $15,000             │
  │                                              │
  │  R - REPEAT                                  │
  │  Cash Left in Deal:      $76,800             │
  │  ($91,800 invested - $15,000 back)           │
  │                                              │
  │  ✗  BRRRR DOES NOT WORK HERE                │
  │                                              │
  │  You recover only 16% of your cash.          │
  │  The purchase price is too close to ARV      │
  │  for BRRRR to make sense. This is a          │
  │  buy-and-hold deal, not a BRRRR deal.        │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────────

  5-YEAR HOLD PROJECTION

  Assumptions:
  ├── Appreciation:     3.5% annually
  ├── Rent Growth:      2.5% annually
  ├── Expense Growth:   2% annually
  └── Down Payment:     25% ($71,250)

  ┌──────┬──────────┬──────────┬──────────┬──────────┐
  │ Year │ Cash Flow│ Equity   │ Apprec.  │ Total    │
  │      │ (annual) │ (paydown)│          │ Return   │
  ├──────┼──────────┼──────────┼──────────┼──────────┤
  │ 1    │ -$7,128  │ $3,912   │ $9,975   │ $6,759   │
  │ 2    │ -$6,516  │ $4,188   │ $10,324  │ $7,996   │
  │ 3    │ -$5,880  │ $4,482   │ $10,685  │ $9,287   │
  │ 4    │ -$5,220  │ $4,800   │ $11,059  │ $10,639  │
  │ 5    │ -$4,536  │ $5,136   │ $11,446  │ $12,046  │
  └──────┴──────────┴──────────┴──────────┴──────────┘

  5-Year Summary:
  Total Cash Flow:             -$29,280
  Equity from Paydown:         $22,518
  Equity from Appreciation:    $53,489
  Total Wealth Built:          $46,727
  On $91,800 invested:         51% total (10.2%/yr)

  Note: The return is driven entirely by
  appreciation and principal paydown, not cash
  flow. You are paying $487/mo (average) out of
  pocket for the first 5 years to build $46K in
  equity. That is a wealth-building play, not an
  income play.

  ──────────────────────────────────────────────────

  RISK FACTORS

  Jurisdiction
  ├── Texas is landlord-friendly
  ├── Eviction timeline: 30-45 days typical
  ├── No state income tax
  └── Verdict: LOW RISK - favorable legal environment

  Insurance
  ├── Home built 1958 - may need updated plumbing/
  │   electrical for standard policy
  ├── Not in a flood zone (check FEMA maps)
  └── Estimate: $1,900/yr (verify with agent)

  Property Tax
  ├── Current: $5,420/yr
  ├── Dallas County reassesses on sale
  ├── May increase to $5,800-6,200 after purchase
  │   at $285K
  └── Texas has no cap on increases for non-homestead

  Neighborhood Trend
  ├── 75201 (Uptown/Oak Lawn): IMPROVING
  ├── Population growing, new development active
  ├── Strong rental demand from young professionals
  ├── Walk Score: 82
  └── Verdict: This area appreciates well.
      The play here is long-term equity, not
      monthly cash flow.

  ──────────────────────────────────────────────────

  DEAL SCORECARD

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  Cash Flow Score:          2 / 10            │
  │    Negative at all leverage levels            │
  │                                              │
  │  Appreciation Potential:   8 / 10            │
  │    75201 is improving, strong demand          │
  │                                              │
  │  Risk Level:               7 / 10            │
  │    TX landlord-friendly, good area, but      │
  │    1958 build adds maintenance risk          │
  │                                              │
  │  Overall:                  5 / 10            │
  │                                              │
  │  ★ RECOMMENDATION:  HOLD                    │
  │                                              │
  │  This property does not cash flow at 7%      │
  │  rates. The math only works as a long-term   │
  │  appreciation play - you are paying out of   │
  │  pocket every month to build equity in a     │
  │  strong neighborhood. That can make sense    │
  │  for investors with W-2 income who want      │
  │  tax benefits and equity growth. But if the  │
  │  investor needs cash flow, this is a pass.   │
  │  At 5.5% rates, this deal turns positive.    │
  │  Worth watching if rates drop.               │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────────

  WHAT MAKES THIS DEAL WORK

  ① Rates drop to 5.5% → refinance, cash flow turns
    positive at ~$80/mo
  ② ADU added → $900+/mo additional income, deal
    works at any rate
  ③ STR strategy → $2,800+/mo gross, cash flow
    positive even at 7%, but requires permit +
    furnishing capital
  ④ Cash purchase → $826/mo positive cash flow,
    2.9% cash-on-cash (weak for cash buyer)

  WHAT KILLS THIS DEAL

  ① Rates stay at 7%+ with no value-add strategy
  ② Major repair on 1958 systems (plumbing,
    electrical, foundation) - eats into any
    equity gains
  ③ Vacancy above 10% - deepens the monthly loss

  ──────────────────────────────────────────────────

  FILES SAVED

  ./clients/2847-maple-ave-dallas-tx/
    investment-analysis.md                    ✓
  ./clients/market-profiles/75201.md         ✓ (updated)
  ./clients/pipeline.md                      ✓ (appended)

  ──────────────────────────────────────────────────

  WHAT'S NEXT

  → /lead-recon          Research the seller for negotiation intel
  → /comp-crusher        Full comp analysis for ARV confidence
  → /investment-analyzer Run another property for comparison

  Or give me another address and purchase price.
```

---

## OUTPUT FORMAT

Follow `~/.claude/skills/client-memory/references/output-format.md` for visual formatting. Every report includes:

1. **Header** - INVESTMENT ANALYSIS with address
2. **Data Sources** - what was pulled live vs cached vs estimated
3. **Property Details** - beds, baths, sqft, year, lot, taxes, condition
4. **Rent Comp Report** - table of 5-10 comps with recommended rent range
5. **Cash Flow Analysis** - full revenue/expense breakdown at primary down payment
6. **Down Payment Comparison** - table showing 20%, 25%, 30% scenarios
7. **Key Metrics** - cap rate, cash-on-cash, GRM, DSCR with verdicts
8. **Value-Add Opportunities** - rent bump, ADU, Section 8, STR assessment
9. **BRRRR Analysis** - only if rehab involved, full B-R-R-R-R breakdown
10. **Hold Projections** - 5-year table with cash flow, equity, appreciation
11. **Risk Factors** - jurisdiction, insurance, taxes, neighborhood trend
12. **Deal Scorecard** - 1-10 ratings + overall recommendation
13. **What Makes/Kills This Deal** - honest summary of upside and downside
14. **Files Saved** - investment analysis, market profile, pipeline entry
15. **What's Next** - suggest /lead-recon, /comp-crusher, or another analysis

**No CyclSales callout.** This is a research-only skill.

---

## CLIENT MEMORY

Read: `./clients/{client-slug}/lead-recon.md`, `./clients/market-profiles/{zip}.md` per ~/.claude/skills/client-memory/SKILL.md

**On every run:**
1. Check for existing property data in `./clients/{address-slug}/`
   - If lead-recon exists: use property data, skip Firecrawl scrape
   - If comp-analysis exists: use for ARV baseline
2. Check for cached market profile in `./clients/market-profiles/{zip}.md`
   - Apply freshness rules per ~/.claude/skills/client-memory/SKILL.md
3. Save investment analysis to `./clients/{address-slug}/investment-analysis.md`
4. Update or create market profile cache
5. Append to `./clients/pipeline.md` with investor client info

---

## KNOWN LIMITATIONS

| Limitation | Workaround |
|-----------|------------|
| Rent comps from Perplexity may be incomplete | Flag count. Recommend checking Rentometer or local property manager for verification. |
| Insurance estimate is approximate | Note: "Verify with insurance agent. Older homes (pre-1970) often cost more." |
| Property taxes reset on sale in many jurisdictions | Flag the likely increase. Do not use current tax amount for cash flow if it will change. |
| Appreciation projections are speculative | Always disclose assumption. Show conservative, moderate, and optimistic scenarios. |
| BRRRR refinance depends on appraisal | Note: "ARV is estimated from comps. Actual appraisal may differ." |
| Vacancy rate is an average, not a guarantee | Note: "Actual vacancy depends on property condition, pricing, and management." |
| STR regulations change frequently | Note: "Verify current STR rules with the city before committing to this strategy." |

---

## QUALITY CHECKLIST

Before delivering, verify:
- [ ] Every number is sourced or flagged as estimated
- [ ] Cap rate calculation does NOT include mortgage payment
- [ ] Property management is included at 10% even if self-managed
- [ ] Vacancy factor is included (never 100% occupancy assumed)
- [ ] Negative cash flow is clearly stated, not hidden
- [ ] BRRRR analysis only appears when rehab is involved
- [ ] Deal scorecard is honest - scores reflect the actual numbers
- [ ] Appreciation is presented as speculative, not guaranteed
- [ ] Hold projections disclose all assumptions
- [ ] Risk factors are specific to this property and jurisdiction
- [ ] Rent comps table includes at least 5 properties
- [ ] No HARD NO words from brand voice
- [ ] No CyclSales callout (research-only skill)
- [ ] Files saved to ./clients/ per memory protocol
- [ ] Market profile cached for the ZIP
