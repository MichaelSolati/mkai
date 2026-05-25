---
name: prospector
description: "Research expired listings, FSBOs, and circle prospecting opportunities with live data - then generate personalized outreach scripts for every channel. Use when the agent needs more listings, wants to prospect expireds/FSBOs, or just sold/listed a home and wants to canvas the neighborhood. Firecrawl analyzes why listings failed. Perplexity provides market context."
---

# /prospector -- Listing Opportunity Research + Outreach Scripts

> **Purpose:** The highest-conversion prospecting sources -- expired
> listings and FSBOs -- convert at 15-25% vs 2-3% for cold leads. But
> agents avoid them because the research takes 20-30 minutes per
> property. This does it in 2 minutes. One address in, a full outreach
> package out.

---

## PREREQUISITE

- **Firecrawl MCP** -- scrapes original listings from Redfin/Zillow/Realtor.com
- **Perplexity MCP** -- pulls market context, comps, and neighborhood data
- Read `~/.claude/skills/client-memory/references/output-format.md` before producing any output
- Read `~/.claude/skills/client-memory/SKILL.md` for save locations

---

## WHAT THIS SKILL DOES

Three modes, each producing a complete outreach package:

1. **EXPIRED** -- Researches why a listing did not sell, then generates
   outreach scripts that address the specific failure points
2. **FSBO** -- Analyzes a for-sale-by-owner listing for pricing accuracy,
   exposure gaps, and liability risks, then generates value-first scripts
3. **CIRCLE** -- Takes a just-sold or just-listed address and generates
   neighbor outreach (letters, door-knock scripts, social posts, radius emails)

Every mode outputs 5 outreach channels:
- Phone call script (with objection handling)
- Email template
- Text message
- Handwritten note template
- Video message script (30 seconds)

## WHAT THIS SKILL DOES NOT DO

- Does not provide seller contact information (phone, email) -- that
  requires paid skip trace services
- Does not guarantee listing data accuracy -- public records lag
- Does not access MLS directly
- Does not send messages -- it generates the scripts

---

## INPUTS

| Input | Required | Example |
|-------|----------|---------|
| Address | Yes | "4821 Cedar Ln, Dallas TX 75214" |
| Mode | Yes | "expired" or "fsbo" or "circle" |
| Agent name | Helpful | "Sarah Johnson" (personalizes scripts) |
| Additional context | Helpful | "Expired after 90 days" or "FSBO on Zillow at $450K" or "Just sold for $412K" |

---

## GOAL

- Primary: Give the agent a research-backed outreach package in
  2-3 minutes that would normally take 20-30 minutes of manual work
- Secondary: Increase listing conversion by leading with specific
  data and insights instead of generic "I can sell your home" pitches

---

## MODE 1: EXPIRED LISTINGS

### Step 1 -- Find and Scrape the Original Listing

Use Firecrawl to locate the listing on Redfin, Zillow, or Realtor.com.

```
SEARCH STRATEGY

  ① Firecrawl search: "{address} site:redfin.com"
  ② If not found: "{address} site:zillow.com"
  ③ If not found: "{address} site:realtor.com"
  ④ If all fail: Use Perplexity for cached listing data

  Use proxy: "stealth" on all scrapes.
  Use waitFor: 5000 on Redfin/Zillow.
```

**Extract from the listing:**

```
LISTING DATA TO PULL

  Property Details
  ├── Beds, baths, sqft, year built, lot size
  ├── Property type (SFH, condo, townhome)
  └── Condition signals (updated, original, etc.)

  Listing History
  ├── Original list price
  ├── Price reduction history (dates + amounts)
  ├── Days on market (total)
  ├── Listing date and expiration/withdrawal date
  └── Previous listing agent and brokerage

  Marketing Signals
  ├── Photo count and quality indicators
  ├── Listing description (full text)
  ├── Virtual tour / video present?
  └── Featured on social media / syndicated sites?

  Comparable Context
  ├── What similar homes sold for during that period
  ├── Average DOM for the area during listing period
  └── List-to-sale ratio for the area
```

### Step 2 -- Analyze Why It Did Not Sell

Run the data through this diagnostic framework:

```
FAILURE ANALYSIS FRAMEWORK

  PRICING
  ├── Was original price above area comps?
  │   Compare list price to median sold in ZIP
  │   during listing period.
  ├── Were price reductions too slow?
  │   If first reduction came after 30+ days,
  │   they chased the market down.
  ├── Did they end up below where they should
  │   have started?
  │   If final price < market value, overpricing
  │   cost them -- buyers assumed something was
  │   wrong.
  └── Score: OVERPRICED / MARGINAL / PRICED OK

  MARKETING QUALITY
  ├── Photo count (< 15 = weak, 15-25 = adequate,
  │   25+ = strong)
  ├── Photo quality signals:
  │   - Dark, cluttered, or poorly staged?
  │   - Exterior photos missing?
  │   - Key rooms missing (kitchen, primary bath)?
  ├── Description quality:
  │   - Generic template language?
  │   - Missing key selling points?
  │   - Too short (< 100 words)?
  ├── Virtual tour or video?
  │   Missing = missed the online buyer
  └── Score: WEAK / ADEQUATE / STRONG

  MARKET TIMING
  ├── Did they list during a seasonal lull?
  │   (Nov-Jan in most markets)
  ├── Was inventory unusually high during their
  │   listing period?
  ├── Did interest rates spike during their time
  │   on market?
  └── Score: BAD TIMING / NEUTRAL / GOOD TIMING

  AGENT PERFORMANCE
  ├── Was the listing syndicated broadly?
  │   (Check if it appeared on Zillow, Realtor,
  │   Redfin, Homes.com)
  ├── Any open houses held?
  ├── Social media presence for the listing?
  ├── Broker responsiveness signals?
  └── Score: UNDERMARKETED / STANDARD / WELL-MARKETED

  PROPERTY CONDITION
  ├── Visible deferred maintenance in photos?
  ├── Outdated finishes that hurt perceived value?
  ├── Curb appeal issues?
  └── Score: NEEDS WORK / DATED / SHOW-READY
```

**Compile into a verdict:**

```
WHY IT DID NOT SELL -- VERDICT

  Primary factor:     {OVERPRICED / UNDERMARKETED / etc.}
  Contributing:       {secondary factor}
  Market context:     {what was happening in the area}

  Confidence:         {HIGH / MEDIUM / LOW}
  (Based on how much data was available)
```

### Step 3 -- Generate Outreach Scripts

Every script must:
- Reference specific data from the analysis
- Show expertise without trashing the previous agent
- Lead with the homeowner's frustration, not your services
- Feel like a conversation, not a pitch

---

#### EXPIRED -- Phone Call Script

```
PHONE SCRIPT -- EXPIRED LISTING
{Address}

  OPENING (10 sec):

  "Hi, this is {agent name}. I'm a real estate
  agent here in {area}. I know your home at
  {street address} was on the market recently
  and it looks like it came off. I'm not calling
  to give you a hard sell -- I just noticed a
  few things about the listing that I think
  contributed to why it sat, and I wanted to
  share them with you. Do you have about
  2 minutes?"

  ──────────────────────────────────────────

  IF THEY SAY YES (transition to insight):

  "So I looked at the data for {neighborhood}
  during the time your home was listed.
  {X} homes in your area sold during that
  same period at a median of ${amount}.
  Your home was listed at ${list price},
  which put it about {$X / X%} above where
  the market was trading.

  {If price reductions happened}:
  It looks like there were {X} price reductions,
  but by the time the price got closer to market,
  buyers had already moved on to newer listings.
  That pattern is really common -- it is not a
  reflection of the home.

  {If marketing was weak}:
  I also noticed the listing had {X} photos
  {and/or} no virtual tour. In this market,
  {X%} of buyers start online. If the first
  impression does not grab them, they scroll
  past.

  The good news -- your home did not sell because
  of something fixable. Not because of the home
  itself."

  ──────────────────────────────────────────

  CLOSE:

  "I put together a quick breakdown of what I
  would do differently if we brought it back to
  market. No obligation. Can I email that over
  to you?"

  ──────────────────────────────────────────

  OBJECTION HANDLING

  "We're taking a break from selling."
  → "Totally fair. Mind if I send the analysis
    anyway? That way if you revisit it in a few
    months, you will have a fresh set of eyes on
    what to adjust. No follow-up unless you
    want it."

  "We're going to relist with our agent."
  → "Makes sense -- you have a relationship there.
    If it would help, I am happy to share the
    market data I pulled so you both have the
    latest numbers going in. No strings."

  "We're not interested."
  → "Understood. I appreciate your time."
    (End the call. Do not push.)

  "What would you price it at?"
  → "Based on what sold in {area} in the last
    60 days, I would be looking at the
    ${range} range. But I would want to see the
    home in person before giving you a firm number.
    Would a quick walk-through work this week?"
```

---

#### EXPIRED -- Email Template

```
EMAIL -- EXPIRED LISTING
{Address}

  Subject: "Your home on {street name} --
  I think I see what happened"

  Hi {owner first name},

  I noticed your home at {address} came off the
  market after {X} days. That is frustrating,
  and I wanted to reach out -- not with a sales
  pitch, but with something I think is actually
  useful.

  I pulled the market data for {neighborhood}
  during the time your home was listed. {X} homes
  in the area sold during that same window at a
  median of ${amount}. Based on your home's
  features ({beds}bd/{baths}ba, {sqft} sqft),
  I think the pricing was {above/at/below} where
  the market was, and {factor #2 -- marketing,
  timing, etc.} may have been a factor too.

  None of that is a knock on your home. It just
  means the approach needs adjusting.

  I put together a one-page breakdown of what
  I would change if this comes back to market.
  Want me to send it over? No obligation, no
  follow-up calls unless you ask.

  {Agent name}
  {Phone}
  {Brokerage}

  Word count: 150-200 words
```

---

#### EXPIRED -- Text Message

```
TEXT MESSAGE -- EXPIRED LISTING
{Address}

  "Hi {owner first name} -- this is
  {agent name}, a local agent in {area}.
  I saw your home on {street} came off the
  market. I pulled the numbers and I think
  I see why it sat. Happy to share what I
  found -- no strings. Want me to send it
  over?"

  Character count: Under 300
  Tone: Casual, helpful, zero pressure
```

---

#### EXPIRED -- Handwritten Note Template

```
HANDWRITTEN NOTE -- EXPIRED LISTING
{Address}

  {Owner first name} --

  I noticed your home on {street name}
  came off the market recently. I work
  with sellers in {neighborhood} and I
  looked at the data for your area --
  I think I see a few things that could
  make a difference if you decide to
  try again.

  No pressure at all. If you are curious,
  give me a call or text.

  {Agent name}
  {Phone}

  Note: Use a real card, not a printed
  template. Blue ink. Keep it short --
  3-4 sentences max.
```

---

#### EXPIRED -- Video Message Script (30 sec)

```
VIDEO MESSAGE -- EXPIRED LISTING
{Address}

  Record on phone, send via text or email.
  BombBomb, Loom, or just a selfie video.

  "Hey {owner first name}, this is
  {agent name}. I noticed your home on
  {street name} came off the market, and
  I wanted to reach out because I actually
  pulled the numbers for {neighborhood}
  and I think I see what happened.

  {X} homes in your area sold during the
  time yours was listed, and the pricing
  and {marketing/timing} look like they
  may have been working against you.

  I put together a quick breakdown. Can I
  send it over? No pressure at all --
  just wanted to share what I found."

  Duration: 25-35 seconds
  Setting: Standing, natural light,
  no background noise
  Tone: Helpful neighbor, not salesperson
```

---

## MODE 2: FSBO (FOR SALE BY OWNER)

### Step 1 -- Find and Scrape the FSBO Listing

```
SEARCH STRATEGY

  ① Firecrawl: "{address} for sale by owner"
  ② Firecrawl: "{address} site:zillow.com" (FSBOs
     often post on Zillow as "Make Me Move" or
     "For Sale By Owner")
  ③ Firecrawl: "{address} site:forsalebyowner.com"
  ④ Perplexity: "{address} FSBO listing details"
```

**Extract:**

```
FSBO DATA TO PULL

  Listing Details
  ├── Asking price
  ├── Beds, baths, sqft, year built
  ├── Property description (full text)
  ├── Photo count
  └── Contact method (phone, email, showing request)

  Exposure Check
  ├── Listed on Zillow?
  ├── Listed on Realtor.com?
  ├── Listed on Redfin?
  ├── Listed on MLS (some FSBOs pay flat-fee entry)?
  ├── Listed on Craigslist / Facebook Marketplace?
  └── Yard sign only?
```

### Step 2 -- FSBO Analysis

Run four analyses:

```
FSBO ANALYSIS FRAMEWORK

  ① PRICE ACCURACY
  ├── Compare asking to recent comps (Perplexity)
  ├── Compare to price per sqft for the area
  ├── Verdict: OVERPRICED / FAIR / UNDERPRICED
  └── Gap: +/- ${amount} from market

  ② EXPOSURE GAPS
  ├── Where IS it listed vs where it SHOULD be
  ├── Missing platforms = missing buyers
  ├── Is it on the MLS? (90%+ of buyers use agents)
  ├── Professional photos? Virtual tour?
  └── Score: LOW EXPOSURE / MODERATE / WELL-EXPOSED

  ③ LIABILITY RISKS
  ├── Disclosure requirements (state-specific)
  │   FSBOs frequently miss required disclosures
  ├── Fair housing compliance in advertising
  ├── Contract risks (no standard forms, no
  │   attorney review, no inspection contingencies)
  ├── Title issues they may not be aware of
  └── Score: HIGH RISK / MODERATE / LOW RISK

  ④ NET PROCEEDS COMPARISON
  ├── FSBO scenario:
  │   Asking price
  │   - Buyer agent commission (2.5-3%)
  │     (most FSBOs still pay buyer agent)
  │   - Closing costs (1-3% seller side)
  │   - Estimated repair concessions
  │   - Average FSBO discount (5.5-6% below
  │     agent-listed median per NAR data)
  │   = Net to seller
  │
  ├── Agent-listed scenario:
  │   Market price (from comps)
  │   - Total commission (5-6%)
  │   - Closing costs (1-3%)
  │   - Lower concessions (agent negotiates)
  │   = Net to seller
  │
  └── Difference: +/- ${amount}
      (Agent-listed often nets MORE even after
      commission -- this is the data that converts)
```

### Step 3 -- FSBO Outreach Scripts

FSBO scripts lead with VALUE, not "hire me." The seller chose
to go it alone for a reason -- usually money. Show them the math.

```
PHONE SCRIPT -- FSBO
{Address}

  OPENING:

  "Hi, this is {agent name}. I saw your home
  on {street name} is for sale. I'm not calling
  to talk you into listing with an agent -- I
  actually work with a lot of sellers in {area}
  and I wanted to share something that might
  help you whether you use an agent or not.
  Do you have a quick minute?"

  ──────────────────────────────────────────

  VALUE LEAD:

  "I pulled the recent sales data for your
  neighborhood. In the last 60 days, {X} homes
  similar to yours sold between ${low} and
  ${high}. Your asking price of ${asking} puts
  you {above/in line with/below} that range.

  {If overpriced}:
  The homes that sold in that range were
  {describe condition/upgrades}. If yours is
  similar, you might be leaving it on the
  market longer than needed at ${asking}.

  {If fair/underpriced}:
  Your pricing looks solid based on what is
  selling. The question is whether enough
  buyers are seeing it."

  ──────────────────────────────────────────

  EXPOSURE INSIGHT:

  "One thing I noticed -- your listing is on
  {platforms found} but not on {platforms
  missing}. About {X%} of buyers in this
  market start their search on {missing
  platform}. That is a chunk of potential
  offers you are not reaching."

  ──────────────────────────────────────────

  CLOSE:

  "I put together a quick market sheet for
  your home -- comps, where buyers are
  looking, and what you might net with and
  without an agent. Want me to send it? No
  pressure -- it is yours either way."

  ──────────────────────────────────────────

  OBJECTION HANDLING

  "I don't want to pay commission."
  → "Totally get it. Let me ask -- are you
    offering a buyer's agent commission? Most
    FSBOs still pay 2.5-3% to the buyer's
    agent. So the real question is whether the
    other 2.5-3% actually nets you more money
    through higher sale price and fewer
    concessions. I ran those numbers -- want
    to see them?"

  "I already have a buyer interested."
  → "Great -- that is a good sign. Have you
    had an attorney review the contract? I
    see a lot of deals fall apart in
    inspection or financing because the
    paperwork was not tight. Happy to share
    a checklist of what to watch for."

  "I don't need an agent."
  → "You might be right. Some sellers do great
    on their own. I just want to make sure you
    have the numbers so you can compare. The
    data is yours no matter what you decide."
```

```
TEXT MESSAGE -- FSBO
{Address}

  "Hi {owner first name} -- this is
  {agent name}. I saw your home on
  {street name} is for sale. I pulled the
  comps for your area and put together a
  quick net sheet showing what you might
  walk away with. Want me to send it?
  No sales pitch -- just the numbers."

  Character count: Under 300
```

---

## MODE 3: CIRCLE PROSPECTING

### Step 1 -- Gather the Trigger Event Data

The trigger is a JUST SOLD or JUST LISTED property. Pull:

```
TRIGGER EVENT DATA

  ├── Address of the sold/listed home
  ├── Sale price or list price
  ├── Beds, baths, sqft
  ├── What it means for neighbor values
  │   (Perplexity: "How does the sale of
  │   {address} at ${price} affect home
  │   values on {street/neighborhood}?")
  └── 3-5 recent sales on the same street
      or within 0.25 miles
```

### Step 2 -- Generate Circle Outreach

```
NEIGHBOR LETTER -- CIRCLE PROSPECTING
{Trigger Address}

  Dear neighbor,

  I wanted to let you know that {address}
  just {sold for ${price} / listed at ${price}}.

  That is {relevant context -- "the highest
  sale on this street in the last 12 months"
  or "in line with what we have been seeing
  in {neighborhood}"}.

  What does this mean for your home? Based
  on recent sales in the area, homes like
  yours ({beds}bd/{baths}ba, similar size)
  are trading between ${low} and ${high}.

  I am not writing to ask you to sell. I
  just track this neighborhood closely and
  thought you would want to know what your
  home is worth right now.

  If you are curious about a specific number
  for your address, I am happy to run the
  comps. No obligation.

  {Agent name}
  {Phone}
  {Brokerage}
```

```
DOOR-KNOCK SCRIPT -- CIRCLE PROSPECTING
{Trigger Address}

  "Hi, I'm {agent name}. I just {sold/listed}
  the home at {address} -- {number} down from
  here. I wanted to stop by because that sale
  at ${price} actually means something for your
  home's value.

  Homes on this street are trading between
  ${low} and ${high} right now, and I am
  seeing {X -- more buyers than usual /
  inventory tightening / values climbing}.

  I am not asking you to sell or anything like
  that. I just track this area and I thought
  you should know. If you ever want a quick
  number on what your place might be worth,
  here's my card."

  IF THEY ENGAGE:
  "What have you been seeing around here?
  Any neighbors thinking about moving?"
  (Turn it into a conversation, not a pitch.
  Referrals from neighbors convert well.)
```

```
SOCIAL MEDIA POST -- CIRCLE PROSPECTING
{Trigger Address}

  Just {sold/listed}: {Street name},
  {Neighborhood}

  {1-2 sentences about the sale/listing
  with a specific data point -- price,
  multiple offers, DOM, etc.}

  {1-2 sentences about what this means for
  the neighborhood. Reference a trend or
  a comparison to recent sales.}

  Thinking about what your home is worth in
  {neighborhood}? Send me your address and
  I will pull the numbers. Takes about
  5 minutes.

  (Tag the neighborhood if platform allows)
```

```
RADIUS EMAIL -- CIRCLE PROSPECTING
{Trigger Address}

  Subject: "A home near yours just
  {sold for ${price} / hit the market}"

  Hi {first name},

  Wanted to give you a quick heads up --
  {address} just {sold for ${price} / listed
  at ${price}}. It is {X blocks / down the
  street / in your neighborhood}.

  Based on that sale and {X} others in the
  area over the last 90 days, homes like
  yours are valued between ${low} and ${high}.
  {Context on trend -- values up, inventory
  tight, buyer demand, etc.}

  If you have been curious about what your
  home is worth, I track this area closely.
  Hit reply and I will send you a quick
  breakdown -- takes me about 5 minutes.

  {Agent name}
  {Phone}

  Word count: 120-180 words
```

---

## COMPLETE EXAMPLE -- EXPIRED LISTING MODE

Input: "1847 Lakewood Blvd, Dallas TX 75214" -- expired

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PROSPECTOR REPORT -- EXPIRED LISTING
  1847 Lakewood Blvd, Dallas TX 75214
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── Redfin (Firecrawl)         ✓ live
  ├── Perplexity (market data)   ✓ live
  └── Zillow (cross-reference)   ✓ live

  ──────────────────────────────────────────────

  PROPERTY SNAPSHOT

  Address:       1847 Lakewood Blvd
  ZIP:           75214
  Type:          Single Family
  Beds/Baths:    4bd / 2.5ba
  Sqft:          2,380
  Year Built:    1948
  Lot:           0.21 acres

  ──────────────────────────────────────────────

  LISTING HISTORY

  Listed:        Oct 12, 2025
  Expired:       Jan 15, 2026
  Total DOM:     95 days
  Agent:         [Previous agent / brokerage]

  Price History:
  ├── Oct 12    $699,000 (original)
  ├── Nov 8     $679,000 (-$20K, day 27)
  ├── Dec 3     $659,000 (-$20K, day 52)
  └── Jan 15    Expired at $659,000

  Photos:        18 (adequate count)
  Virtual Tour:  None
  Description:   Generic -- 72 words, template
                 language, no unique selling points

  ──────────────────────────────────────────────

  WHY IT DID NOT SELL -- ANALYSIS

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  PRIMARY FACTOR: OVERPRICED                  │
  │                                              │
  │  During Oct-Jan, 14 homes sold in 75214      │
  │  in the 4bd/2,000-2,500 sqft range.          │
  │  Median sold: $612,000 ($257/sqft).          │
  │                                              │
  │  This home listed at $699K ($294/sqft) --     │
  │  14% above area median for comparable homes. │
  │                                              │
  │  Price reductions came too slowly. First     │
  │  cut at day 27, second at day 52. By the     │
  │  time it reached $659K, it had been on       │
  │  market 52 days and buyers had moved on to   │
  │  fresher listings.                           │
  │                                              │
  │  Final price of $659K was still 7.7% above   │
  │  area median -- likely needed to be in the   │
  │  $615-635K range to generate real activity.  │
  │                                              │
  └──────────────────────────────────────────────┘

  CONTRIBUTING FACTORS

  Marketing Quality:     ADEQUATE
  ├── 18 photos (acceptable count)
  ├── No virtual tour (missed online buyers)
  ├── Description was 72 words of template
  │   language -- did not highlight Lakewood
  │   walkability, proximity to White Rock Lake,
  │   or the lot size
  └── No video content found

  Market Timing:         NEUTRAL
  ├── Listed in October (decent timing)
  ├── Expired mid-January (seasonal low)
  └── Market was balanced during this period
      (DOM ~24 days for properly priced homes)

  Condition:             DATED BUT LIVABLE
  ├── Kitchen appears original (1948)
  ├── Hardwood floors (positive)
  └── No major deferred maintenance visible

  ──────────────────────────────────────────────

  MARKET CONTEXT (75214 -- Current)

  Median Sold Price:     $625,000
  Avg DOM:               22 days
  List-to-Sale Ratio:    98.4%
  Months of Supply:      2.1

  The market has picked up since this home
  expired. Spring buyer activity is higher and
  DOM is down. A properly priced relaunch would
  enter a stronger market than what this seller
  experienced in Q4.

  ──────────────────────────────────────────────

  RECOMMENDED RELAUNCH PRICE

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  ★ RECOMMENDED: $619,000 - $635,000          │
  │                                              │
  │  Based on 14 comparable sales, condition     │
  │  adjustment for dated kitchen, and current   │
  │  market pace. At $625K this home should      │
  │  attract offers within 15-25 days.           │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────

  OUTREACH SCRIPTS (5 channels)

  ──────────────────────────────────────────────

  ① PHONE SCRIPT

  "Hi, this is {agent name}. I'm a real estate
  agent here in Lakewood. I know your home on
  Lakewood Blvd was on the market for about
  3 months and it looks like it came off in
  January. I'm not calling to give you a hard
  sell -- I actually pulled the sales data for
  your area and I think I see what happened.
  Do you have about 2 minutes?"

  [If yes]

  "So during the time your home was listed,
  14 comparable homes sold in 75214 -- 4 beds,
  similar square footage. The median was about
  $612,000. Your home was listed at $699K,
  which put it about 14% above where the
  market was trading.

  The price reductions helped, but they came
  in $20K steps with 3-4 weeks between them.
  By the time you got to $659K, the listing
  had been sitting for almost 2 months and
  buyers had already moved past it. That is a
  really common pattern -- not a reflection of
  the home itself.

  Here is what is interesting though -- the
  spring market has picked up. DOM in Lakewood
  dropped to 22 days and there are more
  buyers active right now than there were in
  November and December. I think your home
  in the $619-635K range would generate
  serious interest within the first 2 weeks.

  I put together a one-page breakdown of what
  I would change -- pricing, photography
  refresh, and a proper description that
  actually talks about the Lakewood location,
  White Rock Lake, the lot size. Can I email
  it to you?"

  [Objection: "We're done trying"]
  "I get it. 95 days on market is exhausting.
  If it helps, the market right now is
  different from what you experienced in
  November and December. But no pressure --
  can I just send the analysis in case you
  revisit it down the road?"

  [Objection: "What would you price it at?"]
  "Based on what sold recently, I'd be looking
  at $619-635K. But I would want to walk
  through the home before giving you a firm
  number -- condition matters, and photos only
  show so much. Would a quick walk-through
  work this week?"

  ──────────────────────────────────────────────

  ② EMAIL

  Subject: "Your home on Lakewood Blvd --
  I think I see what happened"

  Hi --

  I noticed your home at 1847 Lakewood Blvd
  came off the market after 95 days. That is
  a long time to deal with showings and open
  houses without a result, and I wanted to
  reach out -- not with a sales pitch, but
  with something that might be useful.

  I pulled the sales data for 75214 during
  the time your home was listed. 14 comparable
  homes sold at a median of $612,000. At
  $699K, the original pricing was about 14%
  above that range -- and the reductions came
  in steps that were too slow to catch the
  market.

  None of that is about the home itself. It
  is a 4-bed in Lakewood with hardwood floors
  on a solid lot. The approach just needed
  adjusting.

  The spring market has picked up -- homes
  are moving in 22 days right now vs 30+ in
  Q4. I put together a one-page breakdown of
  what I would do differently. Want me to send
  it? No obligation, no follow-up calls unless
  you ask.

  {Agent name}
  {Phone}
  {Brokerage}

  ──────────────────────────────────────────────

  ③ TEXT MESSAGE

  "Hi -- this is {agent name}, a local agent
  in Lakewood. I saw your home on Lakewood
  Blvd came off the market in January. I
  pulled the numbers and I think the pricing
  was working against you -- 14 similar homes
  sold around $612K during that time. The
  spring market is stronger. Want me to send
  a quick breakdown of what I'd adjust? No
  strings."

  ──────────────────────────────────────────────

  ④ HANDWRITTEN NOTE

  Hi --

  I noticed your home on Lakewood Blvd came
  off the market recently. I work with
  sellers in Lakewood and I looked at the
  numbers -- I think a few adjustments on
  pricing and marketing could make a real
  difference with the spring market picking
  up.

  No pressure at all. If you are curious,
  give me a call or text.

  {Agent name}
  {Phone}

  ──────────────────────────────────────────────

  ⑤ VIDEO MESSAGE SCRIPT (30 sec)

  "Hey, this is {agent name}. I noticed your
  home on Lakewood Blvd came off the market,
  and I wanted to reach out because I pulled
  the sales data for your area and I think
  I see what happened.

  14 comparable homes sold during your listing
  period at around $612K. The pricing was above
  that range and the reductions came a bit
  slow. But the spring market is stronger now --
  homes are moving in 22 days.

  I put together a quick breakdown. Can I send
  it over? No pressure at all."

  ──────────────────────────────────────────────

  FILES SAVED

  ./clients/prospecting/1847-lakewood-blvd-75214/
    expired-analysis.md                           ✓
    outreach-scripts.md                           ✓
  ./clients/market-profiles/75214.md              ✓ (cached)
  ./clients/pipeline.md                           ✓ (1 prospect added)

  ──────────────────────────────────────────────

  WHAT'S NEXT

  → /lead-recon             Deep recon if they respond (~3 min)
  → /comp-crusher           Full CMA for listing appointment (~5 min)
  → /prospector {address}   Research another expired or FSBO
  → /market-intel 75214     Build a content package for this ZIP

  Or give me another address and I'll run the analysis.
```

---

## CONSTRAINTS

- Never use these words: nestled, boasts, stunning, charming, turnkey, prestigious, coveted, unparalleled, bespoke, curated, artisanal. Write in direct, conversational language.
- Never trash the previous agent -- show expertise, not criticism
- Every script must reference specific data from the analysis
- Phone scripts must include objection handling (minimum 3 objections)
- Text messages must be under 300 characters
- Handwritten notes must be under 5 sentences
- Video scripts must be under 35 seconds when read aloud
- Email templates must be 150-200 words
- FSBO net proceeds comparison must show real numbers, not percentages alone
- Circle prospecting must reference the specific trigger event
- All scripts must feel like a conversation, not a pitch
- Do not invent listing data -- if Firecrawl cannot find the listing,
  note what is missing and work with available data
- All output follows `~/.claude/skills/client-memory/references/output-format.md`
- All saves follow `~/.claude/skills/client-memory/SKILL.md`

---

## SAVE LOCATIONS

```
EXPIRED + FSBO:
  ./clients/prospecting/{address-slug}/
    expired-analysis.md    OR  fsbo-analysis.md
    outreach-scripts.md

CIRCLE:
  ./clients/prospecting/{trigger-address-slug}/
    circle-outreach.md

ALWAYS:
  ./clients/market-profiles/{zip}.md  (cache market data)
  ./clients/pipeline.md               (append prospect entry)
  ./clients/learnings.md              (append if outcome is known)
```

---

## PIPELINE ENTRY FORMAT

When adding a prospect to pipeline.md:

```
| Client | Address | ZIP | Stage | Source | Last Updated | Notes |
|--------|---------|-----|-------|--------|-------------|-------|
| [Owner if known] | 1847 Lakewood Blvd, Dallas TX | 75214 | Prospecting | Expired listing | 2026-03-08 | Listed 95 days at $699K, expired Jan 15. Overpriced by ~14%. Recommended relaunch $619-635K. |
```

Stage progression for prospects:
```
Prospecting -> Contacted -> Responded -> Listing Appointment -> Listed
```

---

## BATCH MODE

If the agent provides multiple addresses:

```
"Run these 5 expireds:
 1847 Lakewood Blvd
 2205 Abrams Rd
 4412 Swiss Ave
 1622 N Beacon St
 3301 Mockingbird Ln"
```

Run each property through the full analysis. At the end, add a
priority ranking:

```
  PROSPECT PRIORITY

  ★ 1847 Lakewood Blvd    Overpriced 14%, easy fix
  ★ 4412 Swiss Ave         Undermarketed, strong home
    2205 Abrams Rd         Condition issues, harder sell
    1622 N Beacon St       Relisted with same agent
    3301 Mockingbird Ln    Overpriced + condition issues

  Recommendation: Start with Lakewood Blvd and
  Swiss Ave -- highest probability of conversion.
```
