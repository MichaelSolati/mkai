---
name: neighborhood-dominator
description: "Build a complete neighborhood domination strategy - area guide lead magnet, 12-month content calendar, SEO content package, Google Business Profile strategy, and social media kit. Use when an agent wants to own a specific ZIP code or neighborhood and become THE local expert. Pulls live data via Perplexity and Firecrawl."
---

# Neighborhood Dominator Skill

> **Purpose:** Transform an agent from "I sell houses" to "I AM the [Neighborhood] expert." This is the long-term positioning play that makes sellers come to the agent instead of the agent chasing them. When someone in this ZIP thinks about real estate, they think of you.

---

## PREREQUISITE
- **Perplexity MCP** - neighborhood data, school ratings, market stats, local businesses, commute times
- **Firecrawl MCP** - scraping local business directories, school data, development news

---

## WHAT THIS SKILL DOES

Takes one ZIP code or neighborhood name and builds the complete
local expert package - content, SEO, social, and lead generation
materials that position the agent as the go-to authority.

### 1. Neighborhood Guide (Lead Magnet)
Gated download that gives relocators and buyers real insider
knowledge - not the generic "near great schools and shopping"
that every agent writes.

### 2. 12-Month Content Calendar
Week-by-week content plan covering market updates, local business
spotlights, seasonal events, and community coverage.

### 3. SEO Content Package (6 Pages)
Search-optimized pages targeting the exact queries buyers type
when researching an area.

### 4. Google Business Profile Strategy
8 weeks of GBP posts + Q&A content + photo and review strategy.

### 5. Social Domination Kit
Reel scripts, carousel outlines, weekly post series, and Glif
graphic prompts - all neighborhood-branded.

## WHAT THIS SKILL DOES NOT DO

- Does not create individual listing marketing (that's /listing-arsenal)
- Does not pull comps for a specific property (that's /comp-crusher)
- Does not replace a full lead magnet funnel (that's the lead-magnet skill)
- Does not post content to platforms
- Does not build the actual PDF (output is structured markdown ready for PDF conversion)
- Does not guarantee SEO rankings - it provides the content foundation

---

## INPUTS NEEDED

| Input | Required | Example |
|-------|----------|---------|
| ZIP code or neighborhood | Yes | "75214" or "Lakewood, Dallas" |
| Agent name | Helpful | "Sarah Johnson" |
| Agent website | Helpful | "sarahjohnsonrealty.com" |
| Target buyer profile | Helpful | "Young families" or "Professionals" |
| Agent specialties | Helpful | "Luxury" or "First-time buyers" or "Investment" |
| Specific neighborhoods within ZIP | Helpful | "Focus on Lakewood proper, not Lower Greenville" |

> **Minimum viable input:** Just the ZIP code or neighborhood name. Everything else sharpens the output.

---

## GOAL

- Primary: Position the agent as THE recognized expert in this neighborhood
- Secondary: Generate a steady stream of inbound seller and buyer leads from the area
- Tertiary: Build a content library that compounds over time and ranks in search

---

## 1. NEIGHBORHOOD GUIDE (Lead Magnet)

This is the centerpiece. A downloadable guide that answers every
question a buyer, relocator, or curious homeowner has about the area.

**Output:** Structured content ready for PDF creation.

### Guide Structure

**Cover page:**
- "The [Neighborhood] Guide - Everything You Need to Know About Living in [Area]"
- Agent name, photo placeholder, contact info
- Year + "Edition"

**Section 1: Area Overview + Vibe**
Not generic. Capture the actual character of the place.
- Who lives here (young families, professionals, retirees, mix)
- The feel when you drive through (tree-lined, walkable, suburban, urban)
- What makes it different from the next neighborhood over
- The one thing residents say they love most
- The honest trade-off (every neighborhood has one)

**Section 2: Schools**
- Elementary schools with ratings (GreatSchools or Niche)
- Middle schools with ratings
- High schools with ratings
- Private/charter options in the area
- What parents actually say (not just the numbers)

**Section 3: Restaurants, Shopping, Entertainment**
Specific places. Names, not categories.
- Top 10 restaurants locals go to (not tourist spots)
- Grocery options and distances
- Coffee shops and workspaces
- Bars and nightlife (if applicable to the demographic)
- Shopping - where people actually shop
- Entertainment - theaters, venues, activities

**Section 4: Parks and Outdoor**
- Major parks with features (trails, playgrounds, dog parks, sports)
- Trails and walking paths
- Lakes, pools, recreation centers
- Weekend activities locals actually do

**Section 5: Commute Times**
Specific employers and specific drive times.
- Downtown: [X] min
- Major employer district 1: [X] min
- Major employer district 2: [X] min
- Airport: [X] min
- Public transit options (if any)

**Section 6: Market Snapshot**
- Median home price
- Price range (low end to high end)
- Average days on market
- Year-over-year price trend
- Inventory level (months of supply)
- Typical home types (ranch, two-story, townhome, condo)

**Section 7: Best Streets + Micro-Neighborhoods**
The insider knowledge that shows the agent actually knows the area.
- Named pockets within the ZIP (e.g., "the streets east of the lake" vs "west of Greenville Ave")
- What's different about each micro-area
- Price variations by pocket
- Which streets are most desirable and why

**Section 8: New Development + What's Coming**
- Construction projects in progress
- Zoning changes or proposals
- Planned retail or commercial development
- Infrastructure projects (roads, transit, utilities)
- How these changes affect home values

**Section 9: Cost of Living Comparison**
- Property tax rates vs neighboring areas
- Utility costs (average monthly)
- Insurance estimates
- HOA prevalence and typical costs
- Comparison to 2-3 nearby neighborhoods/ZIP codes

**Section 10: Agent CTA**
- "Thinking about [Neighborhood]? Let's talk."
- Agent contact info
- CMA offer: "Already own here? Find out what your home is worth."
- Link to agent website with UTM tracking

### MCP Usage for Neighborhood Guide

**Perplexity calls (fire in parallel):**

```
Call 1 - Area Profile:
"Detailed neighborhood profile for [neighborhood/ZIP] in [city, state].
Include: who lives there (demographics), neighborhood character and feel,
what makes it unique vs surrounding areas, walkability, typical home styles,
price range, and any notable history."
search_context_size: "high"

Call 2 - Schools:
"All public and notable private schools serving [ZIP/neighborhood] in
[city, state]. Include school name, type (elementary/middle/high),
GreatSchools or Niche rating, enrollment size, and any notable programs
or distinctions."
search_context_size: "high"

Call 3 - Local Businesses + Dining:
"Top restaurants, coffee shops, grocery stores, and local businesses
in [neighborhood/ZIP] [city, state]. Focus on places locals actually
frequent, not tourist spots. Include names, cuisine type, and any
standout details."
search_context_size: "high"

Call 4 - Market Data:
"Current real estate market data for [ZIP] [city, state]:
median home price, average days on market, year-over-year price change,
months of supply, sale-to-list ratio, price per square foot, and
number of homes sold in the last 90 days."
search_context_size: "high"

Call 5 - Commute + Development:
"Commute times from [neighborhood/ZIP] to downtown [city], major
employment centers, and the airport. Also: any new construction,
planned developments, zoning changes, or infrastructure projects
in or near [neighborhood/ZIP]."
search_context_size: "high"
```

**Firecrawl (if needed for specific data):**

```
firecrawl_search:
  query: "[neighborhood] [city] new development construction 2026"
  limit: 5

firecrawl_scrape:
  url: "[local news or development site URL]"
  formats: ["markdown"]
  proxy: "stealth"
  waitFor: 5000
```

---

## 2. 12-MONTH CONTENT CALENDAR

Each month gets 4-5 content pieces planned. The calendar runs on
a weekly cadence with rotating content types.

### Monthly Content Types

**Week 1 - Market Update**
Monthly stats for the neighborhood. Median price, sales volume,
DOM, inventory, and one insight or trend.

**Week 2 - Local Business Spotlight**
Feature a specific restaurant, shop, or business. Interview-style
if possible. Always tag the business.

**Week 3 - Seasonal / Community Content**
Content tied to what's happening that month - events, weather,
holidays, school calendar, outdoor activities.

**Week 4 - "Best Of" or Educational**
Listicle or guide content. "Best brunch spots," "Best dog parks,"
"What to know about property taxes in [ZIP]."

**Week 5 (months with 5 weeks) - Wildcard**
New restaurant opening, historical fact, "then vs now" comparison,
resident spotlight, or market prediction.

### Seasonal Content Anchors

```
  MONTHLY CONTENT ANCHORS

  Jan    New Year market predictions, "What's ahead for [area]"
  Feb    Valentine's date night guide (local restaurants)
  Mar    Spring market kickoff, yard/garden prep local tips
  Apr    School enrollment deadlines, spring events calendar
  May    Memorial Day events, summer activity preview
  Jun    Summer market update, pool/outdoor living content
  Jul    4th of July events, mid-year market check-in
  Aug    Back-to-school guide, fall market preview
  Sep    Fall market push, neighborhood festivals/events
  Oct    Halloween events, "best streets for trick-or-treating"
  Nov    Thanksgiving local dining, year-end market outlook
  Dec    Holiday events, annual market recap + year-ahead preview
```

### Perplexity Calls for Calendar Content

For each month, pull upcoming local events and seasonal context:

```
perplexity_ask: "What local events, festivals, community activities,
and seasonal happenings are planned for [neighborhood/ZIP] [city]
in [month] [year]? Include dates, locations, and any recurring
annual events."
search_context_size: "medium"
```

---

## 3. SEO CONTENT PACKAGE (6 Pages)

Six search-optimized pages targeting the queries buyers actually type
when researching a neighborhood.

### Page 1: "[Neighborhood] Real Estate Guide" (Pillar Page)

```
Target keyword:   [neighborhood] real estate
Secondary:        [neighborhood] homes, [neighborhood] real estate
                  market, living in [neighborhood]
Meta title:       [Neighborhood] Real Estate Guide | [Agent Name]
                  (under 70 chars)
Meta description: Everything you need to know about [neighborhood]
                  real estate - market data, schools, and local
                  insights from a [neighborhood] specialist.
                  (under 155 chars)
Word count:       2,000+
Schema:           LocalBusiness + FAQPage

Structure:
  H1: [Neighborhood] Real Estate - Your Complete Guide
  H2: [Neighborhood] Market Overview
  H2: What Makes [Neighborhood] Different
  H2: Schools in [Neighborhood]
  H2: Things to Do in [Neighborhood]
  H2: [Neighborhood] Home Prices and Trends
  H2: Best Streets and Micro-Neighborhoods
  H2: Is [Neighborhood] Right for You?
  H2: FAQ
  CTA: Talk to a [Neighborhood] Specialist

Internal links:
  → Schools Guide (Page 2)
  → Homes for Sale (Page 3)
  → Moving Guide (Page 4)
  → Is It a Good Place to Live (Page 5)
  → Market Report (Page 6)
```

### Page 2: "[Neighborhood] Schools Guide"

```
Target keyword:   [neighborhood] schools
Secondary:        best schools in [neighborhood], [neighborhood]
                  school ratings, [neighborhood] school district
Meta title:       [Neighborhood] Schools Guide | Ratings + Info
                  (under 70 chars)
Meta description: School ratings, programs, and parent insights
                  for [neighborhood]. Elementary through high
                  school - everything families need to know.
                  (under 155 chars)
Word count:       1,200+
Schema:           FAQPage

Structure:
  H1: [Neighborhood] Schools - Ratings, Programs, and What
      Parents Say
  H2: Elementary Schools
    H3: [School Name] - [Rating]
    (repeat for each school)
  H2: Middle Schools
  H2: High Schools
  H2: Private and Charter Options
  H2: What Parents Love About [Neighborhood] Schools
  H2: FAQ
  CTA: Looking for a Home Near [School Name]?
```

### Page 3: "[Neighborhood] Homes for Sale"

```
Target keyword:   [neighborhood] homes for sale
Secondary:        houses for sale in [neighborhood], [neighborhood]
                  real estate listings, buy a home in [neighborhood]
Meta title:       [Neighborhood] Homes for Sale | [Agent Name]
                  (under 70 chars)
Meta description: Browse [neighborhood] homes for sale. Get
                  market data, new listings, and local expertise
                  from a [neighborhood] real estate specialist.
                  (under 155 chars)
Word count:       800+ (plus dynamic listing content)
Schema:           RealEstateAgent + ItemList

Structure:
  H1: [Neighborhood] Homes for Sale
  H2: Current Market Snapshot
  H2: What You Can Get at Different Price Points
  H2: New Listings This Week (agent updates manually)
  H2: [Neighborhood] Buyer Tips
  H2: Why Work with a [Neighborhood] Specialist
  CTA: Get New [Neighborhood] Listings Before They Hit Zillow
```

### Page 4: "Moving to [Neighborhood]"

```
Target keyword:   moving to [neighborhood]
Secondary:        relocating to [neighborhood], [neighborhood]
                  relocation guide, [city] relocation
Meta title:       Moving to [Neighborhood] | Relocation Guide
                  (under 70 chars)
Meta description: Relocating to [neighborhood]? Local commute
                  times, cost of living, schools, and neighborhood
                  tips from a [neighborhood] real estate agent.
                  (under 155 chars)
Word count:       1,500+
Schema:           FAQPage

Structure:
  H1: Moving to [Neighborhood] - What You Need to Know
  H2: What [Neighborhood] Is Like
  H2: Cost of Living
  H2: Commute Times from [Neighborhood]
  H2: Schools
  H2: Where to Eat, Shop, and Play
  H2: Home Prices and What to Expect
  H2: Pro Tips from a Local
  H2: FAQ
  CTA: Planning a Move to [Neighborhood]? Start Here
```

### Page 5: "Is [Neighborhood] a Good Place to Live?"

```
Target keyword:   is [neighborhood] a good place to live
Secondary:        [neighborhood] pros and cons, living in
                  [neighborhood] review, [neighborhood] neighborhood
                  guide
Meta title:       Is [Neighborhood] a Good Place to Live? | Honest Take
                  (under 70 chars)
Meta description: Honest pros and cons of living in [neighborhood].
                  Schools, commute, costs, and what residents
                  actually think - from a local agent.
                  (under 155 chars)
Word count:       1,200+
Schema:           FAQPage

Structure:
  H1: Is [Neighborhood] a Good Place to Live? An Honest Look
  H2: The Pros
  H2: The Cons (Every Neighborhood Has Them)
  H2: Who [Neighborhood] Is Best For
  H2: Who Should Look Elsewhere
  H2: What Residents Say
  H2: The Bottom Line
  H2: FAQ
  CTA: Want to See [Neighborhood] for Yourself?
```

### Page 6: "[Neighborhood] Market Report [Year]"

```
Target keyword:   [neighborhood] market report [year]
Secondary:        [neighborhood] home prices [year], [neighborhood]
                  real estate market [year], [ZIP] housing market
Meta title:       [Neighborhood] Market Report [Year] | [Agent Name]
                  (under 70 chars)
Meta description: [Neighborhood] real estate market data for [year].
                  Median prices, inventory, days on market, and
                  trends - updated monthly by a local specialist.
                  (under 155 chars)
Word count:       1,000+
Schema:           Article + FAQPage

Structure:
  H1: [Neighborhood] Real Estate Market Report - [Year]
  H2: Market Snapshot
  H2: Price Trends (with data table)
  H2: Inventory and Days on Market
  H2: What This Means for Buyers
  H2: What This Means for Sellers
  H2: Forecast
  H2: FAQ
  CTA: Get Monthly [Neighborhood] Market Updates

Internal links:
  → Real Estate Guide (Page 1)
  → Homes for Sale (Page 3)
```

### Internal Linking Strategy

Every page links to at least 2 other pages in the package:
```
  Page 1 (Pillar) ←→ Pages 2, 3, 4, 5, 6
  Page 2 (Schools) → Pages 1, 4
  Page 3 (Homes) → Pages 1, 6
  Page 4 (Moving) → Pages 1, 2, 5
  Page 5 (Good Place) → Pages 1, 2, 4
  Page 6 (Market) → Pages 1, 3
```

---

## 4. GOOGLE BUSINESS PROFILE STRATEGY

### 8 Weeks of GBP Posts (Pre-Written)

```
  GBP POST CALENDAR

  Week 1:  Market update for [neighborhood]
  Week 2:  Local restaurant spotlight
  Week 3:  Just listed / just sold in [neighborhood]
  Week 4:  Neighborhood photo + "Why I love [area]"
  Week 5:  School info or family activity
  Week 6:  Local business spotlight
  Week 7:  Market stat of the month
  Week 8:  Event or seasonal content
```

Each post: 150-300 words, includes a CTA, ends with
"[Agent Name] - [Neighborhood] Real Estate Specialist"

### Q&A Content (Pre-Seed These)

Common questions buyers ask about the area. Seed these on the
GBP listing as Q&A:

```
  Q: What are the best schools in [neighborhood]?
  A: [Specific schools + ratings]

  Q: How much do homes cost in [neighborhood]?
  A: [Current median + range]

  Q: Is [neighborhood] a good area for families?
  A: [Honest answer with specifics]

  Q: What's the commute from [neighborhood] to downtown?
  A: [Specific time + route]

  Q: Are there parks near [neighborhood]?
  A: [Named parks with features]

  Q: What's the crime like in [neighborhood]?
  A: [Honest, data-referenced answer]
```

### Photo Recommendations

```
  GBP PHOTO LIST

  ├── Streetscapes (tree-lined streets, curb appeal)
  ├── Parks and trails (with people if possible)
  ├── Local restaurants and shops (exterior)
  ├── School buildings
  ├── Community events (farmers market, 5K, etc.)
  ├── Seasonal shots (fall foliage, spring blooms)
  ├── Agent at a local landmark
  └── Neighborhood entrance signs or markers
```

### Review Generation Strategy

```
  REVIEW STRATEGY

  1. After every close in [ZIP], ask for a review
     that mentions the neighborhood by name.
     "Would you mind mentioning [neighborhood]
     in your review? It helps other [area] buyers
     find me."

  2. Target: 2-3 reviews per month that mention
     [neighborhood] by name.

  3. Respond to every review within 24 hours.
     Reference the neighborhood in responses.

  4. QR code on all open house materials linking
     directly to the Google review page.
```

---

## 5. SOCIAL DOMINATION KIT

### Reel / TikTok Script

**"5 Things You Didn't Know About [Neighborhood]"**

```
HOOK (first 2 seconds):
  [Standing in recognizable neighborhood location]
  "You think you know [Neighborhood]?"

THING 1 (5 sec):
  [Walking or driving through area]
  "[Surprising historical fact or little-known detail]"

THING 2 (5 sec):
  [At a specific local spot]
  "[Hidden gem - restaurant, park, shortcut, etc.]"

THING 3 (5 sec):
  [Near schools or family area]
  "[School or family fact that surprises people]"

THING 4 (5 sec):
  [At a development site or new business]
  "[What's coming or recently changed]"

THING 5 (5 sec):
  [Back to opening location]
  "[Market fact - price trend, demand, etc.]"

CTA (3 sec):
  "I'm [Agent Name] - I know [Neighborhood] better
  than anyone. DM me if you're thinking about buying
  or selling here."

Total: 30-45 seconds
```

### Instagram Carousel

**"Living in [Neighborhood] - What to Expect"**

```
  SLIDE 1 (Cover):
  "Living in [Neighborhood]"
  "What to Expect"
  [Neighborhood photo background]

  SLIDE 2 - The Vibe:
  "[One sentence describing the feel]"
  "[Who lives here]"
  "[What makes it different]"

  SLIDE 3 - The Numbers:
  "Median home price: [$X]"
  "Average days on market: [X]"
  "Schools rated: [X/10 average]"

  SLIDE 4 - The Lifestyle:
  "[Top 3 things to do]"
  "[Best restaurant]"
  "[Best outdoor activity]"

  SLIDE 5 - The CTA:
  "Thinking about [Neighborhood]?"
  "[Agent Name] | [Phone]"
  "DM me for a free area guide"
```

### Facebook Post Series - "Neighborhood Spotlight"

Weekly format, same structure every time for brand consistency:

```
  NEIGHBORHOOD SPOTLIGHT: [Specific topic]

  "[One paragraph - 3-4 sentences about the topic.
  Reference a specific place, person, or data point.
  Make it feel like a local telling a friend about
  the area.]"

  [One stat or fact to anchor it]

  "I'm [Agent Name] - I live and sell in [Neighborhood].
  Questions about the area? Drop them below."
```

Topics rotate: restaurants, parks, schools, market data,
new businesses, history, events, "best of" picks.

### Glif Graphic Prompts

**Neighborhood-branded visual template:**
```
Neighborhood real estate branded image.
Text overlay:
  "[NEIGHBORHOOD] MARKET UPDATE"
  "Median Price: [$X]"
  "Avg Days on Market: [X]"
  "[Month] [Year]"
  "[Agent Name] | [Neighborhood] Specialist"
Background: Aerial or streetscape of [neighborhood].
Clean layout, modern sans-serif, white text on
semi-transparent dark overlay.
1080x1080 for Instagram.
```

**Local spotlight graphic:**
```
Local business spotlight image.
Text overlay:
  "LOCAL SPOTLIGHT"
  "[Business Name]"
  "[One-line description]"
  "[Neighborhood], [City]"
Background: Storefront or food photo style.
Same brand template as market update.
1080x1080 for Instagram.
```

---

## DECISION LOGIC

```
IF user provides ZIP or neighborhood only →
  Generate full package (all 5 sections)

IF user says "just the guide" →
  Generate Neighborhood Guide only

IF user says "SEO pages" →
  Generate SEO Content Package only

IF user says "content calendar" →
  Generate 12-Month Calendar only

IF user says "social kit" →
  Generate Social Domination Kit only

IF user says "GBP" or "Google Business" →
  Generate Google Business Profile strategy only

IF Perplexity MCP is connected →
  Pull live data for all sections

IF Perplexity MCP is NOT connected →
  Note data gaps, provide framework with
  placeholder brackets, recommend running
  with Perplexity for specific data

IF Glif MCP is connected →
  Generate graphics alongside copy

IF agent provides target buyer profile →
  Slant all content toward that demographic
```

---

## CONSTRAINTS

- [ ] All content must reference SPECIFIC local details - never "near great restaurants"
- [ ] Restaurant names, park names, school names, business names - always specific
- [ ] Follow ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md for all output formatting
- [ ] Save to ./clients/neighborhoods/{neighborhood-slug}/ per ~/.mkai/profiles/real-estate/skills/client-memory/SKILL.md
- [ ] No HARD NO words from brand voice
- [ ] SEO limits: page titles under 70 chars, meta descriptions under 155 chars
- [ ] UTM tracking on all links: cyclsales.com/[page]?utm_source=[platform]&utm_medium=social&utm_content=neighborhood-[slug]
- [ ] SEO pages include schema markup suggestions
- [ ] Content calendar covers all 12 months with specific content ideas
- [ ] Guide structured for PDF creation
- [ ] Honest about trade-offs - every neighborhood has downsides, acknowledge them
- [ ] No "hidden gem" or "best-kept secret" - those phrases are overused and vague
- [ ] Market data must be sourced and dated

---

## COMPLETE EXAMPLE

### Example Input:
> Build a neighborhood domination package for Lakewood, Dallas TX (75214). I'm Sarah Johnson, sarahjohnsonrealty.com. I focus on young families and move-up buyers.

### Example Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  NEIGHBORHOOD DOMINATOR
  Lakewood, Dallas TX 75214
  Agent: Sarah Johnson
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── Perplexity (call 1)    Area profile + demographics   ✓ live
  ├── Perplexity (call 2)    Schools + ratings              ✓ live
  ├── Perplexity (call 3)    Local businesses + dining      ✓ live
  ├── Perplexity (call 4)    Market data for 75214          ✓ live
  └── Perplexity (call 5)    Commute + development          ✓ live

  ──────────────────────────────────────────────

  SECTION 1: NEIGHBORHOOD GUIDE (Lead Magnet)

  ──────────────────────────────────────────────

  Title: "The Lakewood Guide - Everything You
  Need to Know About Living in East Dallas"

  ── AREA OVERVIEW + VIBE ──

  Lakewood sits just east of downtown Dallas,
  centered around White Rock Lake. It runs
  roughly from Gaston Ave south to East Grand,
  Fitzhugh east to Buckner. The area has a
  mix of 1920s Tudor cottages, 1950s ranch
  homes, and newer construction filling in
  between them.

  The feel: tree-lined streets, people walking
  dogs around the lake, Saturday mornings at
  the Lakewood Brewing taproom or brunch at
  Gemma. It is more established than Uptown,
  more walkable than the suburbs, and still
  close enough to downtown that the commute
  is under 15 minutes.

  Who lives here: young families moving up
  from apartments in Knox/Henderson, dual-
  income professionals who want space without
  a 45-minute commute, and long-time residents
  who bought decades ago and aren't leaving.

  The honest trade-off: property taxes in
  Dallas County are high (2.2%+ effective
  rate). A $450K home means $10K+ per year
  in taxes. Homes east of Abrams tend to be
  more affordable but the school ratings drop.
  Street-by-street research matters here.

  ── SCHOOLS ──

  ┌────────────────────────┬────────┬──────────┐
  │ School                 │ Rating │ Distance │
  ├────────────────────────┼────────┼──────────┤
  │ Stonewall Jackson ES   │ 8/10   │ 0.4 mi   │
  │ Hexter ES              │ 7/10   │ 0.9 mi   │
  │ J.L. Long MS           │ 6/10   │ 0.8 mi   │
  │ Woodrow Wilson HS      │ 7/10   │ 1.1 mi   │
  │ Lakewood ES            │ 7/10   │ 0.6 mi   │
  └────────────────────────┴────────┴──────────┘

  Private options nearby:
  - Lakewood Presbyterian Day School (PreK-1)
  - Bishop Dunne Catholic School (6-12)
  - Greenhill School (PreK-12, 3.5 mi)

  What parents say: Stonewall Jackson is the
  draw for families. It has strong parent
  involvement and a dual-language program.
  Woodrow Wilson has improved significantly
  in the last 5 years - the IB program pulls
  strong students from across the district.

  ── RESTAURANTS + SHOPPING + ENTERTAINMENT ──

  Restaurants locals go to:
  1. Gemma - Italian, brunch spot, always busy
  2. Lucia - nationally recognized, reservations
     required, worth every minute of the wait
  3. Goodfriend Beer Garden - casual, huge patio,
     great for families and dogs
  4. La La Land Kind Cafe - coffee + social mission,
     popular with the WFH crowd
  5. Smoky Rose - BBQ + cocktails, live music
  6. Rapscallion - upscale casual, date night
  7. Cane Rosso - Neapolitan pizza, kid-friendly
  8. Greenville Avenue Pizza Company - late night
  9. HG Sply Co - rooftop patio, Lower Greenville
  10. Truck Yard - outdoor beer garden, food trucks

  Grocery:
  - Whole Foods (Lakewood Blvd, 0.6 mi)
  - Tom Thumb (Gaston Ave, 0.4 mi)
  - Trader Joe's (Lower Greenville, 1.2 mi)

  Shopping:
  - Lower Greenville boutiques (walkable)
  - Lakewood Shopping Center (Abrams + Gaston)
  - Mockingbird Station (1.5 mi - Target, shops,
    Angelika Film Center)

  ── PARKS + OUTDOOR ──

  - White Rock Lake (1,015 acres, 9.3-mile trail,
    kayaking, fishing, dog park, picnic areas)
  - Lakewood Park (playground, sports fields)
  - Tietze Park (community pool, tennis courts)
  - White Rock Creek Trail (connects to the lake
    trail system)
  - Flag Pole Hill (sledding hill in winter,
    kite flying, views of downtown)

  Weekend activities: Saturday morning run around
  the lake, kayak rental from White Rock Paddle Co,
  farmers market at the Good Local Market on
  Gaston, bike ride on the Santa Fe Trail.

  ── COMMUTE TIMES ──

  ┌──────────────────────────┬──────────────────┐
  │ Destination              │ Drive Time       │
  ├──────────────────────────┼──────────────────┤
  │ Downtown Dallas          │ 12 min           │
  │ Uptown / Turtle Creek    │ 10 min           │
  │ Deep Ellum               │ 8 min            │
  │ Medical District / UTSW  │ 15 min           │
  │ North Dallas / Galleria  │ 20 min           │
  │ DFW Airport              │ 35 min           │
  │ Love Field               │ 15 min           │
  │ Richardson / Telecom Cor │ 18 min           │
  └──────────────────────────┴──────────────────┘

  Transit: DART bus routes serve Lakewood.
  Mockingbird Station (1.5 mi) connects to the
  DART light rail for downtown, DFW Airport, and
  North Dallas. Not a transit-first neighborhood,
  but better than most of Dallas.

  ── MARKET SNAPSHOT ──

  ┌──────────────────────────┬──────────────────┐
  │ Metric                   │ 75214 (Mar 2026) │
  ├──────────────────────────┼──────────────────┤
  │ Median Home Price        │ $465,000         │
  │ Price Range              │ $280K - $1.2M    │
  │ Avg Days on Market       │ 18 days          │
  │ YoY Price Change         │ +4.2%            │
  │ Sale-to-List Ratio       │ 98.5%            │
  │ Months of Supply         │ 1.8              │
  │ Avg Price/Sqft           │ $218             │
  │ Homes Sold (90 days)     │ 47               │
  │ Typical Style            │ Tudor, ranch,    │
  │                          │ newer two-story  │
  └──────────────────────────┴──────────────────┘

  ── BEST STREETS + MICRO-NEIGHBORHOODS ──

  The Lakewood Proper pocket (between Gaston,
  Abrams, Mockingbird, and the lake):
  - Highest values, $500K-$1.2M
  - Original Tudors and updated ranches
  - Walking distance to White Rock Lake
  - Stonewall Jackson Elementary district
  - Streets to watch: Lakewood Blvd, Swiss Ave
    extension, Tokalon Park area

  Lower Greenville corridor (west of Abrams):
  - More walkable to restaurants and nightlife
  - $350K-$600K range
  - Younger demographic, some duplex conversions
  - Noisier on weekends near Greenville Ave

  Hollywood Heights / Santa Monica (south of
  Gaston, near the Arboretum):
  - Historic homes, some Dallas landmark status
  - $400K-$800K
  - Quiet, tree-heavy streets
  - Strong appreciation trend

  East of Buckner:
  - More affordable entry point, $250K-$400K
  - Schools rated lower (check specific zone)
  - Rapid turnover - investors active here
  - Good for first-time buyers with flexibility

  ── NEW DEVELOPMENT + WHAT'S COMING ──

  - Mockingbird Station area: additional mixed-use
    planned along the DART corridor
  - Lower Greenville: continued restaurant and
    retail infill, several new concepts opening 2026
  - White Rock Lake trail resurfacing project
    (sections of the 9.3-mile loop being rebuilt)
  - No major zoning changes pending for
    residential Lakewood proper

  ── COST OF LIVING COMPARISON ──

  ┌──────────────┬──────────┬──────────┬──────────┐
  │ Metric       │ Lakewood │ Frisco   │ Plano    │
  ├──────────────┼──────────┼──────────┼──────────┤
  │ Median Price │ $465K    │ $520K    │ $450K    │
  │ Tax Rate     │ 2.2%     │ 2.0%    │ 2.1%     │
  │ Annual Tax*  │ $10,230  │ $10,400  │ $9,450   │
  │ Commute DT   │ 12 min   │ 40 min   │ 30 min   │
  │ Walk Score   │ 72       │ 28       │ 37       │
  │ HOA Common?  │ Rare     │ Common   │ Common   │
  └──────────────┴──────────┴──────────┴──────────┘
  *Estimated on median price

  Source: Perplexity (live data), Mar 2026

  ── CTA PAGE ──

  "Thinking about Lakewood? Let's talk."

  Sarah Johnson
  Lakewood Real Estate Specialist
  214-555-0192
  sarahjohnsonrealty.com?utm_source=guide&utm_medium=pdf&utm_content=neighborhood-lakewood

  "Already own in Lakewood? I can run a detailed
  market analysis on your home - what comparable
  houses have actually sold for, not just online
  estimates. No cost, no pressure."

  ──────────────────────────────────────────────

  SECTION 2: 12-MONTH CONTENT CALENDAR
  (Months 1-3 shown - full 12 months in saved file)

  ──────────────────────────────────────────────

  JANUARY

  Week 1 - Market Update
  "Lakewood 2026 Market Outlook"
  Post: "75214 ended 2025 up 4.2% - here's
  what I see coming for Lakewood in 2026."
  Platform: Facebook, Instagram, GBP

  Week 2 - Local Spotlight
  "La La Land Kind Cafe - Coffee with a Mission"
  Post: Profile of the Lakewood location, their
  hiring model, and why the WFH crowd lives here.
  Platform: Facebook, Instagram

  Week 3 - Seasonal
  "New Year, New Home? What Lakewood Buyers
  Should Know Right Now"
  Post: Spring market preview, inventory levels,
  and why January is the time to get pre-approved.
  Platform: Facebook, IG Carousel

  Week 4 - Best Of
  "5 Best Coffee Spots in Lakewood (Ranked by
  a Local)"
  Post: La La Land, Houndstooth, Pearl Cup,
  Weekend Coffee, Davis Street Espresso.
  Platform: Instagram Carousel, Facebook

  ──────────────────────────────────────────────

  FEBRUARY

  Week 1 - Market Update
  "Lakewood January Recap - What Sold and
  for How Much"
  Post: Closed sales, price trends, DOM.
  Platform: Facebook, Instagram, GBP

  Week 2 - Local Spotlight
  "Lucia - Why It's the Best Restaurant
  in Dallas (and It's in Your Neighborhood)"
  Post: Reservations, what to order, why a
  nationally-recognized spot in Lakewood matters
  for home values.
  Platform: Facebook, Instagram

  Week 3 - Seasonal
  "Valentine's Date Night - 7 Lakewood
  Restaurants You Can Walk To"
  Post: Lucia, Rapscallion, Gemma, HG Sply Co,
  Smoky Rose, Cane Rosso, Goodfriend.
  Platform: Instagram Carousel, Facebook

  Week 4 - Educational
  "What Your Lakewood Home Is Actually Worth
  (Not What Zillow Says)"
  Post: Why online estimates miss the mark on
  Tudors vs ranches vs new builds. Offer
  free CMA.
  Platform: Facebook, GBP

  ──────────────────────────────────────────────

  MARCH

  Week 1 - Market Update
  "Lakewood Spring Market Is Here - What to
  Know If You're Buying or Selling"
  Post: Inventory spike, buyer competition,
  pricing strategy.
  Platform: Facebook, Instagram, GBP

  Week 2 - Local Spotlight
  "White Rock Lake Trail - The Reason Half
  of Lakewood Never Leaves"
  Post: 9.3-mile loop, kayak rentals, dog park,
  best entry points. Run/walk/bike.
  Platform: Instagram Reel + Carousel, Facebook

  Week 3 - Seasonal
  "Spring Yard Prep - 3 Things Lakewood
  Sellers Do Before Listing"
  Post: Curb appeal tips specific to Lakewood
  homes (mature trees, front porch staging,
  Tudor-specific maintenance).
  Platform: Facebook, Instagram

  Week 4 - Best Of
  "Best Patios in Lakewood for When the Weather
  Breaks"
  Post: Truck Yard, Goodfriend, HG Sply Co,
  Smoky Rose, Lakewood Brewing.
  Platform: Instagram Carousel, Facebook

  (Full 12-month calendar saved to file)

  ──────────────────────────────────────────────

  SECTION 3: SEO CONTENT PACKAGE
  (2 page outlines shown - all 6 in saved file)

  ──────────────────────────────────────────────

  PAGE 1: LAKEWOOD REAL ESTATE GUIDE (Pillar)

  Meta title: Lakewood Dallas Real Estate Guide
  | Sarah Johnson (48 chars)

  Meta description: Everything about Lakewood
  real estate - market data, schools, local
  insights from a Lakewood specialist who
  knows every street. (143 chars)

  Target keyword: lakewood dallas real estate
  Secondary: lakewood dallas homes, living
  in lakewood dallas, lakewood TX real estate

  Schema: LocalBusiness + FAQPage

  H1: Lakewood Dallas Real Estate - Your
      Complete Guide

  H2: Why Lakewood
    - Location (east of downtown, White Rock
      Lake, walkable, established)
    - Character (Tudors, ranches, mature trees,
      not cookie-cutter)
    - Community (farmers market, lake trail,
      Lower Greenville)

  H2: Lakewood Market Overview
    - Median price, DOM, trend, inventory
    - Data table with last 12 months
    - How Lakewood compares to Uptown, Park
      Cities, Bishop Arts

  H2: Schools in Lakewood
    - Elementary through high school ratings
    - Link to full Schools Guide (Page 2)
    - The Stonewall Jackson factor

  H2: Neighborhoods Within Lakewood
    - Lakewood Proper, Lower Greenville,
      Hollywood Heights, East of Buckner
    - Price ranges by pocket
    - Who each area is best for

  H2: Things to Do in Lakewood
    - White Rock Lake, Lower Greenville,
      restaurants, parks
    - Weekend routine of a typical Lakewood
      resident

  H2: Home Prices and What to Expect
    - Price by home type (Tudor, ranch, new)
    - Price per sqft ranges
    - What you get at $350K vs $500K vs $750K

  H2: Is Lakewood Right for You?
    - Best for: families, professionals,
      walkability seekers
    - Consider elsewhere if: low tax priority,
      new construction only, top-rated
      suburban schools required

  H2: FAQ (6-8 questions, schema-marked)
    - "How much are homes in Lakewood Dallas?"
    - "What school district is Lakewood in?"
    - "Is Lakewood walkable?"
    - "What is the commute from Lakewood to
      downtown Dallas?"
    - "Are property taxes high in Lakewood?"
    - "Is Lakewood a good investment?"

  CTA: "I'm Sarah Johnson - I sell real estate
  in Lakewood. If you're thinking about buying
  or selling here, I know every street."

  Internal links → Pages 2, 3, 4, 5, 6

  Word count target: 2,200+

  ──────────────────────────────────────────────

  PAGE 5: IS LAKEWOOD A GOOD PLACE TO LIVE?

  Meta title: Is Lakewood Dallas a Good Place to
  Live? Honest Take (53 chars)

  Meta description: Pros and cons of living in
  Lakewood Dallas - schools, commute, taxes,
  and what residents actually think, from a
  local real estate agent. (149 chars)

  Target keyword: is lakewood dallas a good
  place to live
  Secondary: lakewood dallas pros and cons,
  living in lakewood review

  Schema: FAQPage

  H1: Is Lakewood a Good Place to Live?
      An Honest Look

  H2: The Pros
    - Walkability (72 Walk Score, White Rock
      Lake access, Lower Greenville on foot)
    - Character (not a subdivision - every
      street has its own feel)
    - Location (12 min to downtown, 10 to
      Uptown, 8 to Deep Ellum)
    - Schools improving (Woodrow Wilson IB,
      Stonewall Jackson 8/10)
    - Food scene (Lucia, Gemma, Goodfriend -
      some of the best in Dallas)
    - Community (farmers market, lake events,
      neighborhood associations active)

  H2: The Cons (Every Neighborhood Has Them)
    - Property taxes are high (2.2%+, no
      homestead cap equivalent to some suburbs)
    - Older homes = maintenance (foundation,
      plumbing, electrical on pre-1960 homes)
    - School variability (east of Abrams drops,
      check your specific zone)
    - Street flooding in heavy rain (some low
      areas near White Rock Creek)
    - Parking on Lower Greenville weekends
    - No community pool or HOA amenities
      (unlike suburban neighborhoods)

  H2: Who Lakewood Is Best For
    - Young families who want walkability +
      good elementary school
    - Professionals who work downtown or
      in the Medical District
    - People who value character over
      new construction
    - Buyers who prioritize location over
      square footage

  H2: Who Should Look Elsewhere
    - If top-rated suburban schools are
      non-negotiable (look at Frisco, Prosper)
    - If you want new construction with a
      warranty (Celina, Melissa)
    - If low property taxes are the priority
      (Collin County is lower)
    - If you need 3,000+ sqft under $450K
      (not happening in Lakewood)

  H2: What Residents Say
    - "We moved from Frisco for the walkability
      and never looked back"
    - "The lake is the reason we stay"
    - "Taxes are painful but the location
      makes up for it"

  H2: The Bottom Line
    Lakewood works if you value location,
    character, and community over square
    footage and new finishes. The homes are
    older, the taxes are real, and parking
    on Greenville is annoying. But you're
    12 minutes from downtown, you can walk
    to dinner, and the lake is in your
    backyard. For a lot of people, that math
    works out.

  H2: FAQ (schema-marked)
    - "Is Lakewood Dallas safe?"
    - "What's the average home price in
      Lakewood?"
    - "Is Lakewood good for families?"
    - "How far is Lakewood from downtown
      Dallas?"

  CTA: "Want to see Lakewood for yourself?
  I'll show you the streets that don't
  show up on Zillow."

  Internal links → Pages 1, 2, 4

  Word count target: 1,400+

  (All 6 SEO pages outlined in saved file)

  ──────────────────────────────────────────────

  SECTION 4: GBP STRATEGY

  (8-week post calendar, Q&A content,
  photo recommendations, and review strategy
  included in saved file - see GBP STRATEGY
  section above for full framework)

  ──────────────────────────────────────────────

  SECTION 5: SOCIAL DOMINATION KIT

  (Reel script, IG carousel, FB series format,
  and Glif prompts included in saved file -
  see SOCIAL DOMINATION KIT section above)

  ──────────────────────────────────────────────

  FILES SAVED

  ./clients/neighborhoods/lakewood-dallas-75214/
    neighborhood-guide.md                     ✓
    content-calendar-12mo.md                  ✓
    seo-pages/
      01-lakewood-real-estate-guide.md        ✓
      02-lakewood-schools-guide.md            ✓
      03-lakewood-homes-for-sale.md           ✓
      04-moving-to-lakewood.md                ✓
      05-is-lakewood-good-place-to-live.md    ✓
      06-lakewood-market-report-2026.md       ✓
    gbp-strategy.md                           ✓
    social-kit.md                             ✓
  ./clients/market-profiles/75214.md          ✓ (cached)
  ./clients/content-calendar.md               ✓ (12 months added)

  ──────────────────────────────────────────────

  WHAT'S NEXT

  → Start posting Week 1 content immediately
  → Seed GBP Q&A this week (takes 20 minutes)
  → Publish the pillar SEO page first, then
    roll out Pages 2-6 over the next 3 weeks
  → Use the guide as a lead magnet on your site
    and in Facebook ads

  → /lead-magnet        Build a landing page +
                        email sequence for the
                        Lakewood Guide download
  → /seo-content        Write the full 2,200-word
                        pillar page from this outline
  → /content-atomizer   Turn the guide into 15+
                        social posts
  → /creative           Generate Lakewood-branded
                        graphics via Glif

  Or give me another neighborhood and I'll
  build the same package.
```

---

## OUTPUT FORMAT

Follow `~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md` for visual formatting. Every output includes:

1. **Header** - NEIGHBORHOOD DOMINATOR
2. **Data Sources** - what was pulled live vs estimated
3. **Neighborhood Guide** - full guide content structured for PDF
4. **Content Calendar** - 12 months of weekly content ideas
5. **SEO Pages** - 6 page outlines with keywords, meta tags, structure
6. **GBP Strategy** - 8 weeks of posts + Q&A + photo + review strategy
7. **Social Kit** - Reel scripts, carousels, post series, Glif prompts
8. **Files Saved** - all files written to ./clients/neighborhoods/
9. **What's Next** - next skill recommendations

This skill does NOT include a CyclSales callout. It is a strategy and
content skill, not an automation-eligible skill.

---

## CLIENT MEMORY

Save all neighborhood domination materials to
`./clients/neighborhoods/{neighborhood-slug}/`.

**Slug format:** `{neighborhood-name}-{city}-{zip}`
Example: `lakewood-dallas-75214`

**Files created:**
- `neighborhood-guide.md` - full guide content
- `content-calendar-12mo.md` - 12-month content plan
- `seo-pages/` - directory with 6 SEO page outlines
- `gbp-strategy.md` - GBP posts, Q&A, photo list, review strategy
- `social-kit.md` - Reel scripts, carousels, post series, Glif prompts

**Market profile cache** (write to `./clients/market-profiles/{zip}.md`):
All market data pulled for this ZIP gets cached here for other skills
to use. Include `Last Updated: YYYY-MM-DD` header.

**Content calendar** (append to `./clients/content-calendar.md`):
Add all 12 months of planned content to the master calendar.

---

## QUALITY CHECKLIST

Before delivering, verify:
- [ ] Every restaurant, park, school, and business is named specifically?
- [ ] No "near great restaurants" or "close to shopping" - always specific?
- [ ] Neighborhood guide captures the actual character (not generic suburbs copy)?
- [ ] Honest trade-offs included (taxes, school variability, maintenance)?
- [ ] SEO meta titles under 70 characters?
- [ ] SEO meta descriptions under 155 characters?
- [ ] All 6 SEO pages have target keywords, schema, and internal links?
- [ ] Content calendar covers all 12 months with specific topics?
- [ ] GBP posts are pre-written and ready to copy-paste?
- [ ] Social posts reference neighborhood-specific details?
- [ ] Market data is sourced and dated?
- [ ] UTM tracking on all links?
- [ ] No HARD NO words from brand voice?
- [ ] Files saved to ./clients/neighborhoods/{slug}/?
- [ ] Market profile cached to ./clients/market-profiles/{zip}.md?
- [ ] Guide structured for PDF creation (section headers, tables, clear flow)?

---

## KNOWN LIMITATIONS

| Limitation | Workaround |
|-----------|------------|
| Perplexity data may not be current month | Note source date. Market data is directional - within 1-2 months is useful. |
| School ratings change annually | Note source (GreatSchools/Niche) and date. Recommend annual update. |
| Local business info changes (restaurants open/close) | Note as "as of [date]" - recommend quarterly review of guide. |
| Cannot verify micro-neighborhood boundaries exactly | Use known landmarks and streets. Note that boundaries are approximate. |
| SEO pages are outlines, not finished content | Chain to /seo-content to write full pages from these outlines. |
| Guide content is text only - no photos | Agent supplies photos. Glif can generate neighborhood-style graphics. |
| Cannot post to GBP or social platforms directly | All content is copy-paste ready with platform and date noted. |
| 12-month calendar is planned, not scheduled | Agent or CRM handles scheduling. Content ideas are specific enough to execute. |
