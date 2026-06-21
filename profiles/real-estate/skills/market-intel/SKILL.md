---
name: market-intel
description: "Pull live market data for any ZIP or neighborhood and generate client-ready market reports, social media content, and email newsletters. Use when the agent needs weekly/monthly content, a market update for a client, or social posts about local market conditions. One ZIP code → full content package with stats, commentary, and platform-specific posts."
---

# /market-intel -- Weekly Market Content Machine

> **Purpose:** Turn raw market data into a week's worth of content.
> One ZIP code in, a full content package out -- market report,
> social posts, newsletter segment, video scripts. Makes the agent
> look like THE neighborhood expert without spending 4 hours on it.

---

## PREREQUISITE

- **Perplexity MCP** -- pulls live market data (active listings,
  pending, sold, median price, DOM, inventory, trends)
- Read `~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md` before producing any output
- Read `~/.mkai/profiles/real-estate/skills/client-memory/SKILL.md` for save locations

---

## WHAT THIS SKILL DOES

- Takes a ZIP code or neighborhood name
- Perplexity pulls live market data for that area
- Generates a **MARKET REPORT** (client-ready, shareable)
- Atomizes that report into **7 platform-specific content pieces**
- Adds "hot take" commentary -- not just stats but what they mean
- Saves everything to `./clients/market-reports/` and updates
  `./clients/content-calendar.md`

## WHAT THIS SKILL DOES NOT DO

- Does not replace an MLS-sourced CMA (use /comp-crusher for that)
- Does not pull property-specific data (use /lead-recon)
- Does not access MLS directly -- uses Perplexity aggregation
- Does not schedule or post content (copy-paste or use CyclSales)

---

## INPUTS

| Input | Required | Example |
|-------|----------|---------|
| ZIP code or neighborhood | Yes | "75214" or "Lakewood, Dallas" |
| Agent name | Helpful | "Sarah Johnson" (personalizes content) |
| Focus | Helpful | "buyers" or "sellers" or "both" (default: both) |
| Timeframe | Helpful | "last 30 days" or "last 90 days" (default: 30) |

---

## GOAL

- Primary: Give the agent a full week of market content from one
  data pull -- report + 6 ready-to-post pieces
- Secondary: Build the agent's reputation as the go-to local expert
  by publishing consistent, data-backed market commentary

---

## PROCESS

### Step 1 -- Check Cache

Before calling Perplexity, check `./clients/market-profiles/{zip}.md`

```
IF market profile exists AND age < 7 days ->
  Use cached data. Note: "Using cached data for {zip} (X days old)"

IF market profile exists AND age 7-30 days ->
  Re-pull from Perplexity. Overwrite the cache.

IF no market profile exists ->
  Pull from Perplexity. Create the cache.
```

**Scope check:** If the cached file has a `Scope:` line, verify it matches
the current request. "Lakewood neighborhood in 75214" is not the same as
"all of 75214." If scope differs, note it in the report and pull at the
requested scope. When pulling fresh data, always specify the geographic
granularity in the Perplexity query (neighborhood name + ZIP, not just ZIP).

**Market Intel is the authoritative cache source.** Because this skill pulls
the most comprehensive market data, its output ALWAYS saves to
`./clients/market-profiles/{zip}.md` - even if a cache already exists.
Other skills (Lead Recon, Comp Crusher, Nurture Coach) read from this
cache rather than pulling their own conflicting numbers.

### Step 2 -- Pull Market Data (Perplexity)

Query Perplexity for the target ZIP code. Pull ALL of the following:

```
MARKET DATA TO PULL

  Core Stats (last 30 days unless user specifies otherwise)
  ├── Active listings (count)
  ├── Pending listings (count)
  ├── Sold listings (count, last 30 / 60 / 90 days)
  ├── Median sold price
  ├── Median price per sqft
  ├── Average days on market (DOM)
  ├── List-to-sale price ratio (%)
  └── Months of supply (inventory level)

  Trend Data
  ├── Median price: month-over-month change ($ and %)
  ├── Median price: year-over-year change ($ and %)
  ├── DOM: month-over-month change
  ├── DOM: year-over-year change
  ├── Inventory trend (rising, falling, flat)
  └── New listings this month vs last month

  Context
  ├── Dominant property type (SFH, condo, townhome)
  ├── Price range distribution (entry, mid, upper)
  ├── Notable market events (new development, school rezoning,
  │   employer relocation, infrastructure changes)
  └── Interest rate context (current 30yr fixed, impact on
      buying power)
```

**Perplexity prompt pattern:**

```
"Current real estate market statistics for ZIP code {zip}
(or {neighborhood}, {city}). I need: number of active listings,
pending listings, homes sold in the last 30 days, median sold
price, average days on market, list-to-sale price ratio,
months of inventory supply. Also need month-over-month and
year-over-year trends for median price and DOM. Include any
notable local market factors. Data should be as recent as
possible -- cite sources."
```

### Step 3 -- Classify the Market

Apply decision logic to determine framing:

```
MARKET CLASSIFICATION

  IF DOM < 15 AND list-to-sale > 99%
  -> HOT SELLER'S MARKET
     Seller framing: "Your timing is strong"
     Buyer framing: "Move fast, compete smart"

  IF DOM 15-30 AND list-to-sale 97-99%
  -> BALANCED MARKET
     Seller framing: "Price it right, market it well"
     Buyer framing: "You have options but don't wait"

  IF DOM > 30 AND list-to-sale < 97%
  -> COOLING / BUYER-FRIENDLY
     Seller framing: "Preparation and pricing matter more now"
     Buyer framing: "More choices, more negotiating room"

  INVENTORY OVERLAY
  IF months of supply < 2
  -> Add: "If you've been thinking about selling, inventory
     is thin and your home stands out more right now"

  IF months of supply 2-4
  -> Add: "Healthy inventory -- enough for buyers to shop,
     not so much that sellers get lost"

  IF months of supply > 4
  -> Add: "More options hitting the market -- buyers have
     breathing room, sellers need sharper pricing"

  TREND OVERLAY
  IF median price trending UP year-over-year
  -> Add equity angle for sellers, urgency for buyers

  IF median price trending DOWN year-over-year
  -> Add value angle for buyers, realistic pricing for sellers

  IF DOM trending UP
  -> Note the shift. Patience for sellers, opportunity for buyers.
```

### Step 4 -- Generate the Market Report

Build the full report using this structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  MARKET INTEL REPORT
  {Neighborhood / ZIP Code}
  Generated {Month Day, Year}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── Perplexity (market stats)       ✓ live
  ├── {Source cited by Perplexity}    ✓ referenced
  └── Agent overlay                   ✓ applied

  ──────────────────────────────────────────────

  MARKET SNAPSHOT -- {Timeframe}

  Classification:    {HOT / BALANCED / COOLING}

  Active Listings        {count}
  Pending                {count}
  Sold (30 days)         {count}
  Sold (60 days)         {count}
  Sold (90 days)         {count}

  ──────────────────────────────────────────────

  PRICING

  Median Sold Price      ${amount}
  ├── vs Last Month      {+/-$} ({+/-%})
  └── vs Last Year       {+/-$} ({+/-%})

  Median Price/Sqft      ${amount}
  List-to-Sale Ratio     {%}

  ──────────────────────────────────────────────

  MARKET PACE

  Avg Days on Market     {number}
  ├── vs Last Month      {+/- days}
  └── vs Last Year       {+/- days}

  Months of Supply       {number}
  Inventory Trend        {Rising / Falling / Flat}

  ──────────────────────────────────────────────

  WHAT THIS MEANS FOR BUYERS

  {2-3 sentences of plain-language commentary.
  Reference specific numbers. Frame as opportunity
  or caution based on market classification.
  Address affordability, competition level,
  and negotiating position.}

  ──────────────────────────────────────────────

  WHAT THIS MEANS FOR SELLERS

  {2-3 sentences of plain-language commentary.
  Reference specific numbers. Frame around
  timing, pricing strategy, and preparation.
  Be honest -- if the market is cooling, say so.}

  ──────────────────────────────────────────────

  HOT TAKE

  {1-2 sentences of opinionated commentary.
  This is the agent's "voice" -- what they'd
  actually say to a friend asking about the
  market. Not a stat recap. An insight.}

  ──────────────────────────────────────────────

  MONTH-OVER-MONTH COMPARISON

  Metric               This Mo    Last Mo    Change
  ─────────────────────────────────────────────────
  Median Price         ${X}       ${Y}       {+/-}
  Avg DOM              {X}        {Y}        {+/-}
  Active Listings      {X}        {Y}        {+/-}
  Months of Supply     {X}        {Y}        {+/-}
  List-to-Sale Ratio   {X}%       {Y}%       {+/-}
```

### Step 5 -- Atomize into Content Pieces

Generate all 7 platform-specific pieces from the report data.

---

#### PIECE 1: Instagram Carousel Script (5 Slides)

```
INSTAGRAM CAROUSEL -- {ZIP / Neighborhood}

  Slide 1 (HOOK)
  ─────────────────────────────────────
  {Single surprising stat in large text}
  Example: "Homes in 75214 are selling
  in {X} days"

  Slide 2 (CONTEXT)
  ─────────────────────────────────────
  {What that stat means -- 2-3 lines}
  Put the number in perspective.

  Slide 3 (BUYER ANGLE)
  ─────────────────────────────────────
  "What this means if you're buying"
  {1-2 key takeaways for buyers}

  Slide 4 (SELLER ANGLE)
  ─────────────────────────────────────
  "What this means if you're selling"
  {1-2 key takeaways for sellers}

  Slide 5 (CTA)
  ─────────────────────────────────────
  "Want the full {month} market report
  for {neighborhood}? Comment MARKET
  or DM me."

  Caption:
  {2-3 sentences summarizing the update.
  End with a question to drive comments.}

  Hashtags (in first comment, not caption):
  #{neighborhood} #{city}realestate
  #marketupdate #{zip}homes #housingmarket
```

---

#### PIECE 2: Facebook Post (Conversation-Starter)

```
FACEBOOK POST -- {ZIP / Neighborhood}

  {Open with a question or surprising stat
  that makes people stop scrolling.}

  {2-3 short paragraphs with the key
  market data. Use specific numbers.
  Write it like you're telling a friend
  what's happening in the neighborhood.}

  {End with a direct question that
  invites comments -- "Are you seeing
  this in your neighborhood?" or
  "Thinking about making a move this
  year?"}

  Word count: 150-250 words
  No links in the post body
  No hashtags (not a Facebook thing)
```

---

#### PIECE 3: TikTok/Reel Script (Face-to-Camera)

```
TIKTOK / REEL SCRIPT -- {ZIP / Neighborhood}

  HOOK (0-3 sec):
  "{Surprising stat or contrarian take}"
  Example: "Everyone thinks the market
  is slowing down in {area}. Here's what
  the numbers actually say."

  BODY (3-25 sec):
  {Walk through 2-3 key stats. Keep it
  conversational -- talking to the camera
  like you're explaining to a friend.
  Use hand gestures, point to imaginary
  stats.}

  CLOSE (25-30 sec):
  "If you want the full breakdown for
  {neighborhood}, drop a comment or DM
  me {keyword}."

  On-screen text suggestions:
  ├── "{Neighborhood} Market Update"
  ├── Key stat as overlay
  └── "DM {KEYWORD} for full report"

  Duration target: 25-35 seconds
  Orientation: Vertical (9:16)
```

---

#### PIECE 4: Email Newsletter Segment

```
EMAIL NEWSLETTER -- {ZIP / Neighborhood}

  Subject line options:
  ① "{Neighborhood} just did something
     interesting this month"
  ② "What {X} sold homes tell us about
     {neighborhood} right now"
  ③ "The number that surprised me about
     {neighborhood} this month"

  Preview text: {First 40 characters of
  email body}

  Body:

  {Paragraph 1 -- personal tone. Open
  with what caught your attention in the
  data. "I pulled the numbers for
  {neighborhood} this week and one thing
  jumped out..."}

  {Paragraph 2 -- the key stats with
  context. Not a data dump. Pick 3-4
  numbers that tell a story. Compare to
  last month or last year.}

  {Paragraph 3 -- what it means for
  the reader. "If you're thinking about
  selling..." or "If you've been waiting
  for the right time to buy..." One
  clear takeaway.}

  CTA: "Hit reply if you want me to pull
  the numbers for your specific street.
  Takes me about 5 minutes."

  Word count: 200-300 words
  Tone: Like texting a smart friend
```

---

#### PIECE 5: Google Business Profile Post

```
GOOGLE BUSINESS PROFILE POST

  {Neighborhood} Market Update --
  {Month Year}

  {2-3 sentences with key stats.
  Keep it short and local. Reference
  the neighborhood by name.}

  Thinking about buying or selling in
  {neighborhood}? I track these numbers
  every month. Reach out for a
  personalized breakdown.

  Word count: 75-100 words
  Include CTA button: "Learn more" or
  "Call now"
```

---

#### PIECE 6: LinkedIn Post

```
LINKEDIN POST -- {ZIP / Neighborhood}

  {Open with an insight, not a stat.
  "Something shifted in {neighborhood}
  this month that most people missed."}

  {2-3 short paragraphs breaking down
  the data. More analytical tone than
  Facebook -- LinkedIn audience wants
  the "so what" behind the numbers.
  Frame around market dynamics,
  investment implications, or economic
  signals.}

  {Close with a professional but
  approachable CTA. "If you're
  advising clients in {area}, happy
  to share the full dataset." or
  "What are you seeing in your
  market?"}

  Word count: 200-350 words
  No hashtags in body (optional at end)
  Professional but not corporate
```

---

#### PIECE 7: Nextdoor Post (Hyperlocal)

```
NEXTDOOR POST -- {ZIP / Neighborhood}

  {Open with a neighbor-to-neighbor tone.
  "Hey neighbors -- I track the real estate
  numbers for our area every month and wanted
  to share what March looks like."}

  {1-2 short paragraphs with 2-3 key stats.
  Keep it casual and LOCAL. Reference the
  neighborhood by name, not just the ZIP.
  Nextdoor users want hyperlocal -- "our
  neighborhood" not "the Dallas market."}

  {End with a genuine question that invites
  conversation -- "Anyone else noticing more
  For Sale signs on your street?" or "Are
  you seeing the same thing in your part
  of [neighborhood]?"}

  Word count: 100-175 words
  Tone: Neighbor, not agent. Helpful, not salesy.
  No links (Nextdoor suppresses posts with links)
  No hashtags
  No "DM me" CTAs -- let them come to you
  DO mention your role naturally: "As a local
  agent, I pull these numbers monthly" -- once,
  not repeatedly.
```

Why Nextdoor matters: It is the #1 hyperlocal platform
for real estate agents. Homeowners are the primary
audience. Posts about local market data consistently
outperform generic content. Agents who post monthly
market updates on Nextdoor report it as their top
organic lead source for listing appointments.

---

### Step 6 -- Save and Calendar

Save all outputs:

```
FILES TO CREATE

  ./clients/market-reports/{zip}-{YYYY-MM-DD}.md
  (Full market report + all 7 content pieces)

  ./clients/market-profiles/{zip}.md
  (Cache the raw market data for other skills.
   MUST include "Last Updated: YYYY-MM-DD" and
   "Scope: [neighborhood] in [ZIP]" headers.
   This is the authoritative cache - other skills read from it.)

  ./clients/content-calendar.md
  (Append 7 entries -- one per content piece with
  suggested publish dates staggered across the week.
  Update ./clients/content-calendar.md with this week's entries.)
```

**Content calendar entries:**

```
| Date | Type | Topic | Platform | Status | Skill |
|------|------|-------|----------|--------|-------|
| {Mon} | Market Update | {ZIP} {Month} stats | Instagram | Drafted | /market-intel |
| {Tue} | Market Update | {ZIP} {Month} stats | Facebook | Drafted | /market-intel |
| {Wed} | Market Update | {ZIP} {Month} stats | TikTok/Reel | Drafted | /market-intel |
| {Thu} | Market Update | {ZIP} {Month} stats | Email | Drafted | /market-intel |
| {Fri} | Market Update | {ZIP} {Month} stats | LinkedIn | Drafted | /market-intel |
| {Sat} | Market Update | {ZIP} {Month} stats | Google Business | Drafted | /market-intel |
| {Sun} | Market Update | {ZIP} {Month} stats | Nextdoor | Drafted | /market-intel |
```

---

## COMPLETE EXAMPLE

Here is the full output for ZIP code 75214 (Lakewood, Dallas TX):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  MARKET INTEL REPORT
  Lakewood / East Dallas (75214)
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── Perplexity (market stats)       ✓ live
  ├── Redfin, Zillow (referenced)     ✓ referenced
  └── Agent overlay                   ✓ applied

  ──────────────────────────────────────────────

  MARKET SNAPSHOT -- Last 30 Days

  Classification:    BALANCED (leaning seller)

  Active Listings        87
  Pending                34
  Sold (30 days)         41
  Sold (60 days)         79
  Sold (90 days)         118

  ──────────────────────────────────────────────

  PRICING

  Median Sold Price      $625,000
  ├── vs Last Month      +$12,000 (+2.0%)
  └── vs Last Year       +$31,000 (+5.2%)

  Median Price/Sqft      $312
  List-to-Sale Ratio     98.4%

  ──────────────────────────────────────────────

  MARKET PACE

  Avg Days on Market     22
  ├── vs Last Month      -3 days
  └── vs Last Year       -5 days

  Months of Supply       2.1
  Inventory Trend        Flat (slight seasonal uptick)

  ──────────────────────────────────────────────

  WHAT THIS MEANS FOR BUYERS

  You have more options than you did 60 days ago,
  but this is not a buyer's market. Homes priced
  right under $600K are still moving in under 2
  weeks with multiple offers. Above $700K, there
  is more room to negotiate -- DOM jumps to 30+
  days in that range. If you are pre-approved and
  ready, this is a window before spring inventory
  gets absorbed.

  ──────────────────────────────────────────────

  WHAT THIS MEANS FOR SELLERS

  Sellers who price at market are averaging 22 days
  to contract -- that is fast for this time of year.
  The 98.4% list-to-sale ratio means buyers are
  paying close to asking but not over it. If you
  are thinking about listing, the spring wave of
  buyers is here but so is the spring wave of
  inventory. Getting ahead of new listings matters.

  ──────────────────────────────────────────────

  HOT TAKE

  Lakewood is doing what Lakewood always does --
  holding its value while the rest of Dallas
  figures out what is happening. The real story is
  the split: under $600K is a dogfight, over $700K
  is negotiable. If you are pricing a listing
  anywhere in between, the comps from 90 days ago
  are already stale. Pull fresh numbers.

  ──────────────────────────────────────────────

  MONTH-OVER-MONTH COMPARISON

  Metric               This Mo    Last Mo    Change
  ─────────────────────────────────────────────────
  Median Price         $625K      $613K      +$12K
  Avg DOM              22         25         -3 days
  Active Listings      87         82         +5
  Months of Supply     2.1        2.0        +0.1
  List-to-Sale Ratio   98.4%      98.1%      +0.3%

  ──────────────────────────────────────────────

  CONTENT PACKAGE (7 pieces)

  ──────────────────────────────────────────────

  ① INSTAGRAM CAROUSEL -- Lakewood 75214

  Slide 1 (HOOK):
  "Lakewood homes are selling
  in 22 days right now."

  Slide 2 (CONTEXT):
  "That is 3 days faster than last month
  and 5 days faster than this time last
  year. The spring market showed up early
  in East Dallas."

  Slide 3 (BUYER ANGLE):
  "What this means if you are buying:
  Under $600K -- be ready to move fast.
  Over $700K -- you have more room to
  negotiate. The sweet spot is shifting."

  Slide 4 (SELLER ANGLE):
  "What this means if you are selling:
  Sellers are getting 98.4% of asking
  price. Not over asking -- but close.
  Price it right on day one and the
  market will meet you."

  Slide 5 (CTA):
  "Want the full March market report for
  Lakewood? Comment MARKET or DM me."

  Caption:
  "Lakewood March numbers are in. Median
  price hit $625K -- up 5.2% from last
  year. Homes are moving faster than they
  were even a month ago. Are you seeing
  this in your neighborhood?"

  Hashtags (first comment):
  #Lakewood #DallasRealEstate
  #MarketUpdate #75214 #EastDallas

  ──────────────────────────────────────────────

  ② FACEBOOK POST -- Lakewood 75214

  Something interesting happened in
  Lakewood this month.

  Homes are selling in 22 days on average.
  That is 3 days faster than February and
  5 days faster than this time last year.
  Median price hit $625,000 -- up about
  $12K from last month.

  But here is the part most people miss:
  there is a clear split happening. Homes
  under $600K are getting multiple looks
  within the first week. Homes over $700K
  are sitting longer -- 30+ days in some
  cases. Same neighborhood, very different
  experiences depending on price range.

  Sellers are getting about 98% of their
  asking price. Not the bidding wars we
  saw two years ago, but solid.

  Are you keeping an eye on Lakewood
  values? What is your read on the
  spring market?

  ──────────────────────────────────────────────

  ③ TIKTOK / REEL SCRIPT -- Lakewood 75214

  HOOK (0-3 sec):
  "Lakewood homes are selling faster
  this month than any time in the last
  year. Here is why."

  BODY (3-25 sec):
  "22 days average. That is down from
  25 last month and 27 this time last
  year. Median price -- $625K. But
  here is what is interesting -- under
  $600K it is competitive. Over $700K
  you have room to negotiate. Same
  neighborhood, two different markets."

  CLOSE (25-30 sec):
  "If you want me to pull the numbers
  for your specific street in Lakewood
  or East Dallas -- drop a comment or
  DM me MARKET."

  On-screen text:
  ├── "Lakewood March Market Update"
  ├── "22 days avg DOM"
  └── "DM MARKET for full report"

  ──────────────────────────────────────────────

  ④ EMAIL NEWSLETTER -- Lakewood 75214

  Subject: "Lakewood just did something
  interesting this month"

  Preview: "I pulled the numbers for 75214
  this week and..."

  I pulled the March numbers for Lakewood
  this week and one thing jumped out --
  homes are selling faster than they have
  in over a year. Average days on market
  dropped to 22. That is down from 27 at
  this time last year.

  Median sold price hit $625,000, which is
  about $12K higher than February and over
  $31K higher than last March. The list-to-
  sale ratio is sitting at 98.4% -- sellers
  are getting close to full asking, but not
  over it. We are not in bidding war
  territory. Just a solid, steady market.

  If you have been thinking about selling,
  the spring buyer wave is here and
  inventory is still tight at 2.1 months of
  supply. If you are looking to buy, the
  sweet spot is under $600K where things
  move fast -- but above $700K there is
  breathing room.

  Hit reply if you want me to pull the
  numbers for your specific street. Takes me
  about 5 minutes.

  ──────────────────────────────────────────────

  ⑤ GOOGLE BUSINESS PROFILE POST

  Lakewood Market Update -- March 2026

  Homes in Lakewood (75214) are selling in
  an average of 22 days -- faster than any
  point in the last year. Median sold price
  reached $625,000, up 5.2% year-over-year.

  Thinking about buying or selling in
  Lakewood or East Dallas? I track these
  numbers every month. Reach out for a
  breakdown specific to your street.

  ──────────────────────────────────────────────

  ⑥ LINKEDIN POST -- Lakewood 75214

  Something shifted in Lakewood this month
  that most people are not talking about.

  The headline numbers look solid -- median
  price $625K (up 5.2% YoY), average DOM
  22 days (down from 27 YoY), 2.1 months
  of inventory. Healthy by every standard
  measure.

  But the story is in the price bands. Under
  $600K, Lakewood is behaving like a seller's
  market -- multiple showings in the first
  week, offers coming in close to asking.
  Above $700K, it looks different -- 30+ DOM,
  more room for negotiation, price reductions
  showing up after 3-4 weeks.

  For agents advising sellers in that upper
  band: the comps from Q4 are no longer
  reliable. Pull 60-day data at most. For
  buyers, the leverage in the $700K+
  segment is real but it will not last
  through April if rates hold.

  What are you seeing in your market this
  month?

  ──────────────────────────────────────────────

  ⑦ NEXTDOOR POST -- Lakewood 75214

  Hey neighbors -- I pull the real estate
  numbers for Lakewood every month and wanted
  to share what March looks like.

  Homes in our area are selling in 22 days on
  average right now -- faster than any point in
  the last year. Median sold price hit $625K,
  up about 5% from last March. Under $600K,
  things are moving fast with multiple showings
  in the first week. Over $700K, there is more
  breathing room.

  Inventory is still tight at about 2 months of
  supply, which means if you are thinking about
  listing, there is not a lot of competition on
  the market right now. As a local agent, I
  track these numbers monthly -- happy to answer
  any questions about your specific street.

  Anyone else noticing more activity in the
  neighborhood lately?

  ──────────────────────────────────────────────

  FILES SAVED

  ./clients/market-reports/75214-2026-03-08.md   ✓
  ./clients/market-profiles/75214.md             ✓ (cache updated)
  ./clients/content-calendar.md                  ✓ (7 entries added)

  ──────────────────────────────────────────────

  WHAT'S NEXT

  → /neighborhood-dominator  Build full SEO + guide for 75214 (~10 min)
  → /listing-arsenal          Create listing content for a 75214 property (~5 min)
  → /market-intel {new ZIP}   Run another ZIP code for comparison

  Or give me a client name and I'll personalize
  the email for a specific contact.

  ──────────────────────────────────────────────

  MANUAL vs AUTOPILOT

  You just created a week of content in about
  10 minutes. Now copy-paste to each platform.

  Or put it on autopilot:
  CyclSales sends your market update email to the
  right segment automatically and captures leads
  from every piece of content you post.

  cyclsales.com/agents
```

---

## CONSTRAINTS

- Never use these words: nestled, boasts, stunning, charming, turnkey, prestigious, coveted, unparalleled, bespoke, curated, artisanal. Write in direct, conversational language.
- All scripts must feel conversational, not salesy
- Reference specific data in every piece -- never generic
- Every content piece must be able to stand alone
- Hot take section must have an actual opinion, not a stat recap
- Do not invent data -- if Perplexity returns incomplete numbers,
  note the gap and work with what you have
- Facebook posts: no links in body, no hashtags
- Instagram: hashtags in first comment only, not caption
- GBP posts: 75-100 words max
- Email: 200-300 words, personal tone
- LinkedIn: professional but not corporate
- Nextdoor: 100-175 words, neighbor tone, no links, no hashtags, no "DM me" CTAs
- Always include the agent's name if provided
- All output follows `~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md`
- All saves follow `~/.mkai/profiles/real-estate/skills/client-memory/SKILL.md`

---

## PERSONALIZATION

If the agent provides their name, weave it naturally:

- Email: sign off with their name
- Instagram bio reference: "Follow @{agent} for monthly updates"
- Facebook: write in first person as the agent
- LinkedIn: first person, professional voice

If the agent specifies a focus (buyers only, sellers only):

- Still pull all data (cache it)
- Weight the commentary and content toward the specified audience
- Adjust CTAs accordingly ("Thinking about selling?" vs
  "Looking for your next home?")

---

## MULTI-ZIP COMPARISON MODE

If the agent provides 2-3 ZIP codes:

- Pull data for all ZIPs
- Add a comparison table at the end of the report
- Create one "comparison" social post that highlights
  the differences between neighborhoods
- Save each ZIP to its own market profile cache

```
  ZIP-TO-ZIP COMPARISON

  Metric               75214      75218      75228
  ─────────────────────────────────────────────────
  Median Price         $625K      $435K      $310K
  Avg DOM              22         28         35
  Months Supply        2.1        2.8        3.4
  List-to-Sale         98.4%      97.2%      96.1%
  YoY Price Change     +5.2%      +3.8%      +1.2%
```

This comparison format works well for agents who farm
multiple neighborhoods and want to show expertise across
a wider area.
