---
name: listing-presentation
description: "Build a complete, data-driven listing presentation that wins the appointment. Pulls comps from /comp-crusher, market data from /market-intel, and marketing previews from /listing-arsenal. Generates a branded PDF-ready presentation with pricing strategy, marketing plan, agent track record, and seller net sheet. Use when the agent has a listing appointment and needs to outshine the competition."
---

# /listing-presentation -- Win the Listing Appointment

You are building the single most important document in a listing agent's
business. This is the presentation that wins the appointment, signs the
listing agreement, and starts the transaction.

Most agents show up with a generic CMA printout and a pitch about how
hard they work. This agent shows up with a branded, data-backed
presentation that includes ACTUAL MOCKUPS of the marketing campaign
they will run for the seller's home.

That is the difference. The agent who shows the work before they get
hired is the agent who gets hired.

Read ./clients/ per ~/.mkai/profiles/real-estate/skills/client-memory/SKILL.md
Follow all output formatting rules from ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md

---

## What This Skill Produces

A 10-section listing presentation saved to
`./clients/{slug}/listing-presentation.md` - structured for
conversion to a polished PDF.

Sections:
1. Cover
2. About Me / Why Me
3. Market Overview
4. Comparable Sales
5. Pricing Strategy
6. Marketing Plan (the killer section)
7. Communication Plan
8. Net Proceeds Estimate
9. Timeline
10. Next Steps

---

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Property address | Yes | "4821 Cedar Ln, Dallas TX 75214" |
| Seller name | Yes | "John and Mary Thompson" |
| Agent name | Yes | "Sarah Johnson" |
| Agent brokerage | Yes | "Keller Williams" |
| Agent phone/email | Yes | "214-555-1234 / sarah@kw.com" |
| Agent stats | Helpful | "42 transactions in 2025, 8 years experience" |
| Agent testimonials | Helpful | Short quotes from past clients |
| Google review count | Helpful | "87 reviews, 4.9 stars" |
| Agent specialties | Helpful | "Lakewood, M Streets, East Dallas" |
| Buyer database size | Helpful | "847 active buyers in DFW" |
| Comp data | Auto | Pulled from /comp-crusher if available |
| Market data | Auto | Pulled from /market-intel if available |

If the agent does not provide stats, testimonials, or review counts,
leave placeholder brackets: `[YOUR TRANSACTION COUNT]`. Do not invent
numbers. The presentation must be honest.

---

## Decision Logic

### Data Dependencies

```
IF ./clients/{slug}/comp-analysis.md exists
   AND age < 30 days
   -> Pull pricing tiers, comp details, net sheet, ARV
   -> Note: "Using comp data from [date]"

IF no comp data exists for this address
   -> Show gap notice (per ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md)
   -> Recommend: /comp-crusher first (~5 min)
   -> Offer: "Continue without" - presentation will have
      placeholder pricing and no net sheet

IF ./clients/{slug}/lead-recon.md exists
   -> Pull property details, owner background, motivation signals
   -> Use motivation signals to set presentation tone

IF no lead-recon data exists
   -> Ask for basic seller context (1 question max):
      "Quick context on the seller - relocating, downsizing,
      investor, first-time seller, or something else?"

IF ./clients/market-profiles/{zip}.md exists
   AND age < 30 days
   -> Pull market overview stats
   -> Note cache age per freshness rules

IF no market profile exists
   -> Pull via Perplexity if connected
   -> If no Perplexity, use comp data to build a lighter
      market overview section
```

### Seller Type Detection

The presentation tone shifts based on the seller's situation.
Detect from lead-recon data or agent input:

```
IF seller is emotional (divorce, estate, death in family,
   forced relocation, downsizing after loss)
   -> Lead with empathy and process clarity
   -> Tone down aggressive pricing language
   -> Emphasize: "Here is what happens next, step by step"
   -> Do NOT lead with "maximize your price"
   -> Section 2 (Why Me) emphasizes experience handling
      sensitive transactions

IF seller is analytical (investor, data-driven, finance
   background, multiple properties)
   -> Lead with numbers and ROI framing
   -> Show DOM distributions, list-to-sale ratios, absorption
   -> Include cost-of-carry calculations if relevant
   -> Section 5 (Pricing) gets the most real estate

IF seller is first-time (never sold before, inherited
   property, accidental landlord)
   -> More education throughout - explain each step
   -> Define terms (DOM, list-to-sale ratio, earnest money)
   -> Section 7 (Communication Plan) and Section 9 (Timeline)
      get extra detail
   -> Reassurance without condescension

IF seller is motivated (needs to sell fast, already bought
   replacement, job relocation with deadline)
   -> Emphasize speed of the marketing plan
   -> Show the Week 1 blitz in detail
   -> Pricing Strategy section focuses on aggressive tier
   -> Timeline section highlights fastest-case scenario

IF seller type is unknown
   -> Default to professional-neutral tone
   -> Balance data and process equally
```

---

## Presentation Structure -- All 10 Sections

### Section 1: COVER

```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LISTING PRESENTATION

  {Property Address}

  Prepared exclusively for {Seller Name}

  {Agent Name}
  {Brokerage}
  {Phone} | {Email}

  {Date}

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Rules:
- Clean. No graphics descriptions. No filler.
- "Prepared exclusively for" - signals this is custom, not a template
- Date format: Month Day, Year (e.g., Mar 8, 2026)

---

### Section 2: ABOUT ME / WHY ME

This section answers the seller's unspoken question: "Why should I
hire you instead of the other two agents I'm interviewing?"

Every claim needs proof. No "I work hard" or "I'm passionate about
real estate." Those are empty. Show the record.

**Required elements:**

```
  WHY ME

  Track Record
  ├── Transactions in {year}:     {number}
  ├── Years in business:          {number}
  ├── Avg days on market:         {number} (market avg: {number})
  └── List-to-sale ratio:         {percent}%

  What Sets Me Apart
  ① {Specific, provable differentiator}
  ② {Specific, provable differentiator}
  ③ {Specific, provable differentiator}

  What Clients Say
  "{Short testimonial quote}" - {Client name}
  "{Short testimonial quote}" - {Client name}

  Online Reputation
  Google Reviews: {count} reviews | {stars} stars
```

**Differentiator rules:**
- Each must be specific and provable
- Good: "I sell homes in Lakewood 11 days faster than the
  market average - 14 DOM vs 25 DOM in 2025"
- Good: "Every listing gets a 47-point marketing campaign
  including professional photography, drone video, 3D tour,
  and targeted social ads"
- Good: "I personally handle every showing - no hand-off to
  a junior agent or showing assistant"
- Bad: "I work harder than anyone else"
- Bad: "I'm passionate about helping families"
- Bad: "I go above and beyond"

If agent does not provide stats, use brackets:
```
  Transactions in 2025:     [YOUR COUNT]
  Avg days on market:       [YOUR AVG DOM]
```

---

### Section 3: MARKET OVERVIEW

Translate raw market data into plain language the seller
understands. The data matters, but the interpretation is
what builds trust.

**Required elements:**

```
  MARKET OVERVIEW
  {Neighborhood/City}, {ZIP} | {Month Year}

  Current Conditions
  ├── Active listings:         {number}
  ├── Pending:                 {number}
  ├── Sold (last 30 days):     {number}
  ├── Sold (last 90 days):     {number}
  ├── Median sold price:       ${amount}
  ├── Avg days on market:      {number}
  ├── List-to-sale ratio:      {percent}%
  └── Months of inventory:     {number}

  Price Trends
  ├── Median price (90 days ago):  ${amount}
  ├── Median price (today):        ${amount}
  └── Change:                      {+/-}${amount} ({percent}%)

  Buyer Demand
  ├── Showings per listing (avg):  {number}
  ├── Multiple offer frequency:    {percent}%
  └── Buyer profile:               {description}
```

After the data, include a plain-language translation:

```
  WHAT THIS MEANS FOR YOUR HOME

  {2-4 sentences translating the data into what the seller
  should expect. Be honest. If it's a buyer's market, say so
  and explain how the marketing plan compensates. If it's a
  seller's market, explain why pricing still matters.}
```

**Source requirements:**
- Pull from market-profiles/{zip}.md if cached and fresh
- Pull via Perplexity if no cache or cache > 30 days
- If no data available, state: "Market data not available
  for this ZIP. Recommend running /market-intel first."
- Always show data source indicator per ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md

---

### Section 4: COMPARABLE SALES

Pull from /comp-crusher data if available. If not, this
section gets a placeholder directing the agent to run comps.

**Required elements:**

```
  COMPARABLE SALES
  {Number} properties | Sold within {timeframe}

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  COMP 1: {Address}                           │
  │  Sold: ${price}  |  {date}                   │
  │  {beds}bd / {baths}ba  |  {sqft} sqft        │
  │  DOM: {days}  |  {distance} from subject     │
  │  Notes: {key similarities or differences}    │
  │                                              │
  │  COMP 2: {Address}                           │
  │  Sold: ${price}  |  {date}                   │
  │  {beds}bd / {baths}ba  |  {sqft} sqft        │
  │  DOM: {days}  |  {distance} from subject     │
  │  Notes: {key similarities or differences}    │
  │                                              │
  │  ... (5-7 comps total)                       │
  │                                              │
  └──────────────────────────────────────────────┘

  Adjustments Summary
  ├── Subject property:    {beds}bd/{baths}ba, {sqft} sqft
  ├── Avg comp sold price: ${amount}
  ├── Avg comp sqft:       {number}
  ├── Avg price/sqft:      ${amount}
  └── Subject est. value:  ${amount} (based on $/sqft adj)
```

**Notes field for each comp must include:**
- What makes it comparable (same neighborhood, similar size,
  same era of construction)
- Key differences that affect value (pool vs no pool, updated
  kitchen vs original, lot size difference)
- Whether it supports or challenges the recommended price

---

### Section 5: PRICING STRATEGY

This is where the agent earns the listing. Sellers choose the
agent who explains pricing with data, not the one who tells
them what they want to hear.

**Required elements:**

```
  PRICING STRATEGY

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  ★ RECOMMENDED: ${price}                     │
  │    ({strategy name})                         │
  │                                              │
  │  ① Aggressive     ${price}                   │
  │     DOM est: {range} days                    │
  │     Strategy: {1-line description}           │
  │     Likely outcome: {what happens}           │
  │                                              │
  │  ② Market Price  ★ ${price}                  │
  │     DOM est: {range} days                    │
  │     Strategy: {1-line description}           │
  │     Likely outcome: {what happens}           │
  │                                              │
  │  ③ Aspirational   ${price}                   │
  │     DOM est: {range} days                    │
  │     Strategy: {1-line description}           │
  │     Likely outcome: {what happens}           │
  │                                              │
  └──────────────────────────────────────────────┘
```

After the tiers, include THE COST OF OVERPRICING section:

```
  THE COST OF OVERPRICING

  Homes that start overpriced and reduce later sell for
  less than homes priced correctly from day one.

  Data from {area}:
  ├── Homes priced right:     avg {X} DOM, sold at
  │                           {Y}% of list
  ├── Homes with 1 reduction: avg {X} DOM, sold at
  │                           {Y}% of ORIGINAL list
  └── Homes with 2+ reductions: avg {X} DOM, sold at
                                {Y}% of ORIGINAL list

  Every 30 days on market costs approximately ${amount}
  in carrying costs (mortgage, taxes, insurance, utilities).

  {1-2 sentences reinforcing the point without lecturing.
  Be direct, not preachy.}
```

If no comp data is available, show:

```
  ┌──────────────────────────────────────────────┐
  │                                              │
  │  ✗ PRICING DATA NOT YET AVAILABLE            │
  │                                              │
  │  Run /comp-crusher to pull live comps and    │
  │  generate pricing tiers for this property.   │
  │                                              │
  │  → /comp-crusher {address}                   │
  │                                              │
  │  Presentation will be updated automatically  │
  │  once comp data is available.                │
  │                                              │
  └──────────────────────────────────────────────┘
```

---

### Section 6: MARKETING PLAN

This is the killer section. This is what separates this
presentation from every other agent's CMA printout.

The seller sees EXACTLY what marketing their home will receive.
Not vague promises. Specific actions, specific timelines,
specific deliverables.

**Required elements:**

```
  MARKETING PLAN
  What Your Home Gets

  ① Professional Photography + Virtual Tour
     Full professional photo shoot (25-40 photos),
     3D virtual tour, drone aerial shots (if applicable).
     Scheduled within {X} days of listing agreement.

  ② MLS Listing with Optimized Description
     Your home listed on MLS, Zillow, Realtor.com, Redfin,
     and 500+ syndication sites. Custom-written description
     designed to generate showing requests.

     SAMPLE LISTING DESCRIPTION:
     ┌────────────────────────────────────────────┐
     │                                            │
     │  {Write an actual sample MLS description   │
     │  for this specific property. 3-4 lines.    │
     │  Highlight the top selling points.         │
     │  End with a call to action.}               │
     │                                            │
     └────────────────────────────────────────────┘

  ③ Social Media Campaign
     5-day coming soon campaign on Facebook and Instagram,
     followed by Just Listed launch across all platforms.

     SAMPLE SOCIAL POST:
     ┌────────────────────────────────────────────┐
     │                                            │
     │  {Write an actual sample social post for   │
     │  this property. Casual, scroll-stopping,   │
     │  with specific details about the home.}    │
     │                                            │
     └────────────────────────────────────────────┘

  ④ Email to Buyer Database
     Direct email to {number} active buyers in my database
     who match this property's profile (price range, area,
     beds/baths). Sent within 24 hours of MLS entry.

  ⑤ Open House Strategy
     First open house within {X} days of listing. Promoted
     on Zillow, Realtor.com, Facebook, Nextdoor, and via
     neighborhood door-knock invitations.

  ⑥ Targeted Digital Advertising
     Paid Facebook and Instagram ads targeting buyers
     searching in {area}. Budget: ${amount}/week.
     Geo-targeted to a {radius}-mile radius + relocation
     buyers from {top feeder markets}.

  ⑦ Agent-to-Agent Networking
     Personal outreach to top {number} buyer's agents in
     {area}. Broker open / agent preview within first week.

  ⑧ Coming Soon / Pre-Market Campaign
     {X}-day pre-market campaign to build anticipation
     before MLS entry. Teaser posts, agent network
     notification, and early showing requests.
```

After the deliverables, include a WEEK-BY-WEEK TIMELINE:

```
  WEEK-BY-WEEK MARKETING TIMELINE

  WEEK 1: Launch
  ├── Day 1-2    Professional photography + virtual tour
  ├── Day 3      MLS entry + syndication live
  ├── Day 3      Coming soon campaign ends, Just Listed begins
  ├── Day 3      Email blast to buyer database
  ├── Day 4      Social media launch (all platforms)
  ├── Day 5      Digital ad campaign goes live
  ├── Day 5-7    Agent preview / broker open
  └── Day 7      First showing feedback report to you

  WEEK 2: Momentum
  ├── Open house (Saturday or Sunday)
  ├── Digital ads running + optimizing
  ├── Agent-to-agent networking calls
  ├── Showing feedback collected and reviewed
  └── Mid-week status update to you

  WEEK 3: Evaluate
  ├── Full market update report to you
  ├── Showing count, feedback summary, online views
  ├── Strategy review - adjust if needed
  ├── Price positioning check vs new comps
  └── Second open house if warranted

  WEEK 4+: Adapt
  ├── Expanded marketing if needed
  ├── Price adjustment discussion (data-driven)
  ├── Fresh social media push
  ├── Agent outreach round 2
  └── Weekly status reports continue
```

**If /listing-arsenal data exists:**
Pull actual marketing copy samples from the listing-assets/
directory and use them in the SAMPLE boxes above. This makes
the presentation even stronger - the seller sees real copy,
not placeholders.

---

### Section 7: COMMUNICATION PLAN

Sellers fire agents over communication failures, not marketing
failures. This section prevents that.

```
  COMMUNICATION PLAN
  How We Stay Connected

  Weekly Updates
  ├── Every {day} you receive a written status report
  ├── Includes: showings, feedback, online views, inquiries
  └── Delivered via {email/text/both}

  Showing Feedback
  ├── After every showing, I collect buyer agent feedback
  ├── You receive a summary within 24 hours
  └── Patterns flagged (if 3+ buyers mention the same thing,
      we address it)

  Offer Presentation
  ├── Every offer presented within {X} hours of receipt
  ├── Side-by-side comparison if multiple offers
  ├── My recommendation + rationale (you make the decision)
  └── Counter-offer strategy discussed before responding

  Availability
  ├── Call or text anytime: {phone}
  ├── Response time: within {X} hours during business hours
  └── After hours: {policy}

  Decision Framework
  You make all final decisions. My job is to give you the
  data, my recommendation, and the options - then execute
  whatever you decide.
```

---

### Section 8: NET PROCEEDS ESTIMATE

The number the seller actually cares about: what do I walk
away with?

Pull from /comp-crusher net sheet if available. Otherwise
build from the recommended price.

```
  NET PROCEEDS ESTIMATE
  At Recommended List Price: ${price}

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  Sale Price (estimated)      ${amount}       │
  │                                              │
  │  Less:                                       │
  │  ├── Listing agent commission  -${amount}    │
  │  │   ({percent}% of sale price)              │
  │  ├── Buyer agent commission    -${amount}    │
  │  │   ({percent}% of sale price)              │
  │  ├── Title insurance           -${amount}    │
  │  ├── Escrow / closing fees     -${amount}    │
  │  ├── Property taxes (prorated) -${amount}    │
  │  ├── HOA transfer fees         -${amount}    │
  │  ├── Home warranty (if offered)-${amount}    │
  │  ├── Estimated repairs/credits -${amount}    │
  │  └── Mortgage payoff (est.)    -${amount}    │
  │                                              │
  │  ──────────────────────────────────────────  │
  │  ESTIMATED NET PROCEEDS       ${amount}      │
  │                                              │
  └──────────────────────────────────────────────┘

  Note: These are estimates. Actual closing costs vary.
  Title company will provide exact figures once under
  contract. Mortgage payoff amount should be verified
  with your lender.
```

If mortgage payoff is unknown, show:

```
  │  ├── Mortgage payoff           -$[VERIFY]    │
  │  │   (contact your lender for exact payoff)  │
```

Show net proceeds at all three price tiers if comp data
is available:

```
  NET PROCEEDS COMPARISON

  ├── At Aggressive  (${price}):  ~${net}
  ├── At Market      (${price}):  ~${net}  ★
  └── At Aspirational(${price}):  ~${net}
```

---

### Section 9: TIMELINE

```
  TIMELINE
  From Signed Agreement to Sold

  PRE-LISTING (Days 1-7)
  ├── Sign listing agreement
  ├── Schedule professional photography
  ├── Home prep (declutter, touch-ups, staging consult)
  ├── Write MLS description + marketing copy
  ├── Launch coming soon campaign
  └── Agent preview / broker open

  ACTIVE MARKETING (Day 8+)
  ├── MLS live + syndication
  ├── Social media + digital ads running
  ├── Open houses (weekends)
  ├── Showings + feedback collection
  └── Weekly status reports

  OFFER + NEGOTIATION (when offers arrive)
  ├── Offer review within {X} hours
  ├── Counter-offer strategy (if needed)
  ├── Multiple offer management (if applicable)
  └── Accepted offer → under contract

  UNDER CONTRACT TO CLOSE (30-45 days typical)
  ├── Option period / inspections (Days 1-10)
  ├── Appraisal (Days 10-21)
  ├── Buyer financing finalization (Days 21-35)
  ├── Title work + closing prep (Days 25-40)
  ├── Final walkthrough (Day before close)
  └── Closing day

  ESTIMATED TOTAL TIMELINE
  ├── Best case:    {X} weeks (list to close)
  ├── Typical:      {X} weeks
  └── Conservative: {X} weeks
```

Adjust timelines based on market data. In a hot market with
low DOM, compress the estimates. In a slow market, be honest
about longer timelines.

---

### Section 10: NEXT STEPS

```
  NEXT STEPS
  Let's Get Started

  ① Sign the listing agreement
     I'll walk you through every line. No surprises.

  ② Schedule photography
     I'll coordinate with my photographer. Typically
     within {X} days of signing.

  ③ Prep your home
     Quick wins that make a difference:
     ├── Declutter countertops and surfaces
     ├── Deep clean (I can recommend a service)
     ├── Touch-up paint on scuffs and nail holes
     ├── Maximize natural light (open blinds, replace
     │   dim bulbs)
     ├── Fresh flowers or plant at the entry
     └── {Property-specific recommendation}

  ④ Launch marketing campaign
     Within {X} days, your home will be live on MLS,
     social media, email, and targeted ads.

  I handle the marketing, the showings, the negotiations,
  and the paperwork. You focus on your next chapter.
```

---

## Output Format

The presentation is saved as a single markdown file at
`./clients/{slug}/listing-presentation.md`

Terminal output follows standard ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LISTING PRESENTATION
  {Address}
  Generated {Date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── Comp data ({slug}/comp-analysis.md)  {status}
  ├── Market profile ({zip}.md)            {status}
  ├── Lead recon ({slug}/lead-recon.md)    {status}
  └── Listing assets                       {status}

  ──────────────────────────────────────────────

  {Full 10-section presentation}

  ──────────────────────────────────────────────

  FILES SAVED

  ./clients/{slug}/listing-presentation.md    ✓

  WHAT'S NEXT

  → /listing-arsenal    Generate marketing assets (~15 min)
  → "Export as markdown" Save polished document for PDF conversion
  → /open-house-machine Plan the first open house (~5 min)

  Or update any section - just tell me what to change.
```

---

## Constraints

1. **No generic claims.** Every differentiator, every stat,
   every selling point must have a number or proof behind it.
   "I work hard" is not a differentiator. "I sold 42 homes
   in 2025 with an average of 14 days on market" is.

2. **No invented data.** If the agent did not provide their
   stats, use brackets: `[YOUR COUNT]`. Do not fabricate
   transaction counts, review numbers, or track records.

3. **Pricing must show the math.** The pricing section is not
   just a recommendation - it is the data that supports the
   recommendation. Show the comps, the adjustments, the DOM
   ranges. Sellers respect the data, not the opinion.

4. **Marketing plan must be specific.** Not "I'll market your
   home on social media." Instead: "I'll run a 5-day coming
   soon campaign on Instagram and Facebook, followed by a
   Just Listed email to my database of 847 active buyers
   in DFW." Specifics build confidence.

5. **The net sheet must be honest.** Show real commission
   rates, real closing costs, real estimates. If something
   is unknown, say so. Never inflate the net proceeds to
   make the presentation look better.

6. **No HARD NO words.** Check every line against the brand
   voice HARD NO list. No "game-changing marketing plan."
   No "guaranteed results." No "at the end of the day."

7. **Premium feel, not templated.** The presentation should
   feel like it was custom-built for this seller and this
   property. Use the property address, neighborhood name,
   and specific details throughout - not generic placeholders.

8. **This is the agent's presentation, not CyclSales content.**
   No CyclSales callout, no automation upsell. This document
   is for the agent to hand to their potential client.

9. **Empathy-aware.** If the seller situation involves
   divorce, death, financial distress, or other emotional
   circumstances, the tone adjusts. Lead with process
   clarity and support, not aggressive pricing language.

10. **Sample copy must be real.** The sample MLS description
    and sample social post in the Marketing Plan section must
    be written for THIS property, not generic examples.

---

## What Comes Next

After the presentation is built:

→ /listing-arsenal - Generate the actual marketing assets
  once the listing is signed (photos, social posts, email
  blasts, open house materials)

→ "Export as markdown" - The presentation is structured for
  easy conversion to a polished, branded PDF document

→ /open-house-machine - Plan and execute the first open
  house event

This skill does NOT include a CyclSales callout. The listing
presentation is the agent's document for their client, not a
follow-up sequence or marketing automation output.

---

## Complete Example

The following example demonstrates the quality level expected.
It shows 5 of the 10 sections with full content for a
realistic property and agent.

---

### EXAMPLE: Sarah Johnson presenting for 4821 Cedar Ln, Dallas TX 75214

**Context:** Sarah Johnson, a Keller Williams agent in Dallas,
has a listing appointment with John and Mary Thompson. The
Thompsons are empty nesters downsizing from their 4-bedroom
home in Lakewood. They've lived there 22 years. Sarah has
comp data from /comp-crusher and market data cached for 75214.

---

#### Section 1: COVER (Example)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LISTING PRESENTATION

  4821 Cedar Ln
  Dallas, TX 75214

  Prepared exclusively for
  John and Mary Thompson

  Sarah Johnson
  Keller Williams Park Cities
  214-555-1234 | sarah@kwparkcities.com

  March 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### Section 2: WHY ME (Example)

```
  WHY ME

  Track Record
  ├── Transactions in 2025:     42
  ├── Years in business:        8
  ├── Avg days on market:       14 (market avg: 27)
  ├── List-to-sale ratio:       98.7%
  └── Lakewood sales (2025):    11

  What Sets Me Apart

  ① I sell Lakewood homes 13 days faster than the
     market average. In 2025, my listings averaged
     14 days on market vs 27 for the 75214 ZIP.
     That is not luck - it is pricing strategy and
     a marketing launch that creates urgency from
     day one.

  ② Every listing gets a 47-point marketing campaign.
     Professional photography, drone aerials, 3D
     Matterport tour, custom property website, social
     media ads, email to my buyer database of 847
     active DFW buyers, agent networking, and two
     open houses in the first 14 days. I do not cut
     corners on marketing because the first two weeks
     determine the outcome.

  ③ I handle every showing and negotiation personally.
     No hand-off to a team member, no showing
     assistant, no "my transaction coordinator will
     call you back." When a buyer's agent calls, they
     talk to me. When an offer comes in, I review it
     with you the same day.

  What Clients Say

  "Sarah's pricing recommendation was spot-on. We had
  three offers in the first week and closed above asking.
  She knew the neighborhood better than any other agent
  we interviewed." - The Meyers Family, 2024

  "After two bad experiences with other agents, Sarah
  was a relief. She told us what our home was actually
  worth, not what we wanted to hear. It sold in 9
  days." - David and Christine Park, 2025

  Online Reputation
  Google Reviews: 87 reviews | 4.9 stars

  ──────────────────────────────────────────────
```

---

#### Section 5: PRICING STRATEGY (Example)

```
  PRICING STRATEGY

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  ★ RECOMMENDED: $625,000 (Market Price)      │
  │                                              │
  │  ① Aggressive     $599,000                   │
  │     DOM est: 5-10 days                       │
  │     Strategy: Price below recent comps to     │
  │     trigger multiple offers and a bidding     │
  │     war. Targets the buyer pool at $575-625K. │
  │     Likely outcome: 2-4 offers in the first   │
  │     week. Final sale price likely $610-635K.  │
  │     Risk: Could sell at $599K if buyer pool   │
  │     is thinner than expected.                │
  │                                              │
  │  ② Market Price  ★ $625,000                  │
  │     DOM est: 14-21 days                      │
  │     Strategy: Priced at the top of the comp   │
  │     range, reflecting the updated kitchen and │
  │     large lot. Attracts serious buyers without│
  │     scaring off the $600K shoppers.           │
  │     Likely outcome: Strong interest in weeks  │
  │     1-2, offer(s) near asking price.          │
  │     Risk: Low. Price is supported by 4 of 6  │
  │     comps.                                   │
  │                                              │
  │  ③ Aspirational   $659,000                   │
  │     DOM est: 35-55 days                      │
  │     Strategy: Tests the top of the market.    │
  │     Requires a buyer who sees the value in    │
  │     the lot size and location.                │
  │     Likely outcome: Slower traffic. Probable  │
  │     price reduction at 30 days to $635K.      │
  │     Risk: Stale listing perception. Homes     │
  │     that reduce sell for less than homes       │
  │     priced right from day one.                │
  │                                              │
  └──────────────────────────────────────────────┘

  THE COST OF OVERPRICING

  Homes that start overpriced and reduce later sell for
  less than homes priced correctly from day one. This
  is consistent across every market.

  Data from Lakewood / 75214 (last 12 months):
  ├── Homes priced right:     avg 18 DOM, sold at
  │                           98.7% of list price
  ├── Homes with 1 reduction: avg 47 DOM, sold at
  │                           95.1% of ORIGINAL list
  └── Homes with 2+ reductions: avg 78 DOM, sold at
                                91.3% of ORIGINAL list

  On a $625,000 home, every 30 days on market costs
  approximately $4,200 in carrying costs (mortgage
  interest, property taxes, insurance, utilities).

  Pricing at $659K and reducing to $625K after 30 days
  does not get you the same result as listing at $625K
  on day one. The market reads a price reduction as a
  signal that something is wrong, and buyers adjust
  their offers downward accordingly.
```

---

#### Section 6: MARKETING PLAN (Example)

```
  MARKETING PLAN
  What Your Home Gets

  ① Professional Photography + Virtual Tour
     Full professional shoot: 35+ photos, including
     twilight exterior shots to showcase the mature
     landscaping and covered patio. 3D Matterport
     virtual tour so out-of-town buyers (Dallas has
     a large relocation buyer pool) can walk through
     your home from anywhere. Drone aerial showing
     the oversized lot relative to neighbors.
     Scheduled within 3 days of listing agreement.

  ② MLS Listing with Optimized Description
     Your home listed on NTREIS MLS, syndicated to
     Zillow, Realtor.com, Redfin, Homes.com, and
     500+ partner sites. Custom description written
     to generate showing requests, not just describe
     the house.

     SAMPLE MLS DESCRIPTION:
     ┌────────────────────────────────────────────┐
     │                                            │
     │  Lakewood traditional on one of Cedar Ln's │
     │  best lots - 9,800 sqft with mature oaks   │
     │  and a covered patio built for year-round   │
     │  entertaining. 4 bedrooms, 3 baths, 2,450  │
     │  sqft with a recently updated kitchen       │
     │  (quartzite counters, new appliances, soft- │
     │  close cabinetry). Original hardwood floors │
     │  throughout the main living areas. Two      │
     │  living spaces - front formal and a den     │
     │  that opens to the backyard. Walk to        │
     │  Lakewood Elementary (rated 9/10) and       │
     │  the shops on Abrams. Schedule your private │
     │  showing today.                             │
     │                                            │
     └────────────────────────────────────────────┘

  ③ Social Media Campaign
     5-day coming soon campaign on Facebook and
     Instagram targeting the DFW buyer audience,
     followed by a Just Listed launch on listing day.

     SAMPLE SOCIAL POST:
     ┌────────────────────────────────────────────┐
     │                                            │
     │  Coming soon in Lakewood.                  │
     │                                            │
     │  4 bed, 3 bath on a 9,800 sqft lot with    │
     │  mature oaks. Updated kitchen. Original     │
     │  hardwoods. Covered patio that makes the    │
     │  backyard feel like an extra room.          │
     │                                            │
     │  Walk to Lakewood Elementary and the shops  │
     │  on Abrams.                                │
     │                                            │
     │  Hitting the market next week. DM me for   │
     │  early showing access.                     │
     │                                            │
     └────────────────────────────────────────────┘

  ④ Email to Buyer Database
     Direct email to 847 active buyers in my database
     who are searching in East Dallas at $550-700K.
     Sent within 24 hours of MLS entry.

  ⑤ Open House Strategy
     First open house on the second weekend after
     listing. Promoted on Zillow, Realtor.com,
     Facebook, Nextdoor (Lakewood neighborhood),
     and via door-knock invitations to 50 homes on
     Cedar Ln and adjacent streets.

  ⑥ Targeted Digital Advertising
     Paid Facebook and Instagram ads targeting buyers
     actively searching in Lakewood, M Streets, and
     East Dallas. Budget: $150/week. Geo-targeted to
     a 10-mile radius plus relocation buyers from
     Austin, Houston, and California (top DFW feeder
     markets per 2025 data).

  ⑦ Agent-to-Agent Networking
     Personal outreach to the top 25 buyer's agents
     who closed in Lakewood and East Dallas in the
     last 6 months. Broker open / agent preview on
     the Thursday before MLS launch.

  ⑧ Coming Soon / Pre-Market Campaign
     7-day pre-market campaign starting the day after
     photography. Teaser posts on social media, agent
     network email, and yard sign with "Coming Soon"
     rider. Goal: build a showing list before day one
     on MLS.

  ──────────────────────────────────────────────

  WEEK-BY-WEEK MARKETING TIMELINE

  WEEK 1: Launch
  ├── Day 1-2    Professional photography + virtual tour
  ├── Day 3      MLS entry + syndication live
  ├── Day 3      Coming soon campaign ends, Just Listed
  │              campaign begins
  ├── Day 3      Email blast to 847 active DFW buyers
  ├── Day 4      Social media launch (FB, IG, Nextdoor)
  ├── Day 5      Digital ad campaign goes live ($150/wk)
  ├── Day 5-7    Agent preview / broker open
  └── Day 7      First showing feedback report to you

  WEEK 2: Momentum
  ├── Open house (Saturday 1-3 PM)
  ├── Digital ads running + performance optimization
  ├── Agent-to-agent networking calls
  ├── All showing feedback collected and reviewed
  └── Wednesday status update to you (email + call)

  WEEK 3: Evaluate
  ├── Full market update report delivered
  ├── Showing count, feedback themes, Zillow views,
  │   social ad impressions
  ├── Strategy review: are we on track?
  ├── Price positioning check vs any new comps
  └── Second open house if traffic warrants it

  WEEK 4+: Adapt
  ├── Expanded marketing if needed (new ad creative,
  │   price adjustment, broader targeting)
  ├── Fresh social media content (different photos,
  │   new angle)
  ├── Agent outreach round 2
  └── Weekly status reports continue every Wednesday
```

---

#### Section 8: NET PROCEEDS ESTIMATE (Example)

```
  NET PROCEEDS ESTIMATE
  At Recommended List Price: $625,000

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  Sale Price (estimated)      $625,000        │
  │                                              │
  │  Less:                                       │
  │  ├── Listing agent commission  -$18,750      │
  │  │   (3.0% of sale price)                    │
  │  ├── Buyer agent commission    -$18,750      │
  │  │   (3.0% of sale price)                    │
  │  ├── Title insurance           -$3,400       │
  │  ├── Escrow / closing fees     -$1,800       │
  │  ├── Property taxes (prorated) -$2,900       │
  │  ├── HOA transfer fees         -$0           │
  │  ├── Home warranty (if offered)-$550         │
  │  └── Estimated repairs/credits -$2,000       │
  │                                              │
  │  Subtotal deductions           -$48,150      │
  │                                              │
  │  Mortgage payoff (est.)        -$142,000     │
  │  (Verify exact payoff with your lender)      │
  │                                              │
  │  ──────────────────────────────────────────  │
  │  ESTIMATED NET PROCEEDS       $434,850       │
  │                                              │
  └──────────────────────────────────────────────┘

  NET PROCEEDS COMPARISON

  ├── At Aggressive  ($599,000):  ~$409,350
  ├── At Market      ($625,000):  ~$434,850  ★
  └── At Aspirational($659,000):  ~$467,950

  Note: The aspirational price assumes full-price sale.
  If the home sits 45+ days and reduces to $635K, net
  proceeds drop to approximately $444,650 - plus $4,200
  in additional carrying costs. The effective difference
  between pricing aspirational and pricing at market
  narrows to roughly $5,600 while adding 30+ days of
  uncertainty.

  These are estimates. Your title company will provide
  exact figures once under contract. Mortgage payoff
  amount should be confirmed with your lender before
  closing.
```

---

#### Terminal Output (Example)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LISTING PRESENTATION
  4821 Cedar Ln, Dallas TX 75214
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── Comp data (comp-analysis.md)       ✓ 2 days old
  ├── Market profile (75214.md)          ✓ 5 days old
  ├── Lead recon (lead-recon.md)         ✓ 7 days old
  └── Listing assets                     ✗ not yet run

  Seller type detected: Empty nester / downsizing
  Tone: Professional, process-clear, respectful of the
  transition - these sellers have 22 years of memories
  in this home.

  ──────────────────────────────────────────────

  {Full 10-section presentation rendered here}

  ──────────────────────────────────────────────

  FILES SAVED

  ./clients/thompson-4821-cedar-ln-dallas-tx-75214/
    listing-presentation.md                       ✓
  ./clients/pipeline.md                           ✓ (updated)

  WHAT'S NEXT

  → /listing-arsenal    Generate all 25+ marketing
                        assets for this listing (~15 min)
  → "Convert to PDF"    Create polished PDF for the
                        listing appointment
  → /open-house-machine Plan the first open house (~5 min)

  Or tell me what to adjust. I can rework any section.
```

--- End of example ---
