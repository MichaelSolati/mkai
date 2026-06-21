---
name: sphere-engine
description: "Build and maintain a 12-month touch calendar for past clients and sphere of influence. Use when the agent wants to stay top-of-mind with their database, generate referrals, or build a systematic relationship maintenance program. Generates personalized monthly touches across email, text, social DM, and handwritten notes."
---

# Sphere Engine Skill

> **Purpose:** 64% of sellers use an agent they've worked with before or were referred to. This skill keeps the agent top-of-mind 365 days a year without being annoying. Systematic touches that feel personal - not mass-blast newsletters that everyone ignores.

---

## PREREQUISITE
- **Perplexity MCP** - local event research, market data for personalized updates
- **Firecrawl MCP** - optional, for scraping neighborhood market stats

---

## WHAT THIS SKILL DOES

- Takes sphere categories (past buyers, past sellers, referral partners, local business owners, friends/family)
- Generates a 12-MONTH TOUCH CALENDAR with specific content for each month
- Every touch has 4 delivery versions: email, text, social DM, and handwritten note
- Adjusts cadence by category (recent clients get monthly, older clients get quarterly)
- Personalizes by transaction type - a buyer who closed 6 months ago gets different content than a seller from 3 years ago
- References the contact's actual property, neighborhood, and situation

## WHAT THIS SKILL DOES NOT DO

- Does not send messages (that's the agent's job, or CyclSales on autopilot)
- Does not replace /review-engine (that handles the immediate post-close sequence)
- Does not create listing marketing (that's /listing-arsenal)
- Does not build nurture sequences for active leads (that's /nurture-coach)

---

## INPUTS NEEDED

| Input | Required | Example |
|-------|----------|---------|
| Agent's market area | Yes | "Dallas TX 75214" |
| Sphere size | Helpful | "About 200 contacts" |
| Category focus | Helpful | "Past clients mostly" |
| Start month | Helpful | "Start from March" (default: current month) |
| Contact details | Helpful | Name, address, close date, transaction type |

> **Minimum viable input:** Market area. The skill builds a generic calendar that the agent customizes. With contact details, it personalizes every touch.

---

## GOAL

- Primary: Build a 12-month touch calendar that keeps the agent top-of-mind with their entire sphere
- Secondary: Generate referrals through well-timed asks (after value has been delivered, never cold)
- Tertiary: Make maintaining relationships feel manageable - the system tells the agent exactly what to send and when

---

## SPHERE CATEGORIES + CADENCES

| Category | Touch Frequency | Priority | Reasoning |
|----------|----------------|----------|-----------|
| Past clients (last 2 years) | Monthly | Highest | Recent relationship, still remember you, most likely to refer |
| Past clients (2-5 years) | Bi-monthly | High | Still remember you but fading - need consistent touches |
| Past clients (5+ years) | Quarterly | Medium | Re-establish the connection before they forget you entirely |
| Referral partners (lenders, title, inspectors) | Monthly | High | Mutual business - they send you deals, you send them deals |
| Sphere (friends, family, neighbors) | Quarterly | Medium | Know you personally, will refer when asked |
| Local business owners | Quarterly | Medium-low | Cross-promotion opportunities, community presence |

---

## 12-MONTH TOUCH CALENDAR

Each month has a primary touch type. Rotate through the year so contacts never get the same kind of message back-to-back.

### Month 1: Home Anniversary Message
Personalized to their purchase/close date. This is the most personal touch in the calendar - it shows you remember a date that matters to them.

**Trigger:** Close date anniversary (month matches)
**Personalization:** Reference their specific property, what they were looking for when you worked together, and how the neighborhood has changed since they moved in.

### Month 2: Market Update for THEIR Neighborhood
Not a generic citywide report. Pull data for their specific ZIP code - median price change, DOM, recent sales near them, what their home might be worth now.

**Data source:** Perplexity for market stats, cached market profiles if available
**Personalization:** Reference their street, their school district, recent sales within a quarter mile.

### Month 3: Seasonal Homeowner Tip
Practical, useful content that has nothing to do with selling. Spring maintenance checklist, winter prep, summer energy savings, fall gutter cleaning - whatever matches the season.

**Tone:** Helpful neighbor, not salesperson.
**Personalization:** Adjust for their home type (condo vs single family), age of home, and climate zone.

### Month 4: Local Event or Recommendation
"This new restaurant near you..." or "The farmers market on Greenville Ave starts back up this Saturday." Show that you know their neighborhood and you are part of the community.

**Data source:** Perplexity for local events and openings
**Personalization:** Reference their specific area, not a citywide event list.

### Month 5: Referral Ask (Soft)
Timed AFTER 4 months of value delivery. This is the first ask - and it is soft. Frame it as: "If you know anyone thinking about buying or selling, I'd appreciate the introduction." Not pushy. Not desperate.

**Timing matters:** Asking for referrals before delivering value feels transactional. By month 5, you have earned the ask.

### Month 6: Home Value Update
"Your neighborhood's average price moved to $X." Homeowners are curious about their equity. Give them the number without asking for anything in return.

**Data source:** Perplexity or cached market profile for their ZIP
**Personalization:** Reference their purchase price if known, show appreciation since close.

### Month 7: Seasonal Tip + Helpful Resource
Similar to Month 3 but paired with a resource - a link, a vendor recommendation, a checklist PDF. Something they can save or share.

**Examples:** "Here's the home maintenance checklist I give all my clients" or "My favorite handyman in [area] is [name] - he does great work."

### Month 8: Community Content
"Best [holiday] events near you" or "Top 5 things happening in [neighborhood] this month." Position yourself as the local expert who knows everything happening in the area.

**Data source:** Perplexity for local events
**Personalization:** Their specific ZIP or neighborhood.

### Month 9: Market Update for Their Area
Second market update of the year. Show the trend since Month 2 - prices up or down, inventory changing, any shifts. Keep them informed without trying to sell.

**Personalization:** Compare to the Month 2 numbers if available. "When I sent your last update in [Month 2], homes in your area were averaging $X. Now they're at $Y."

### Month 10: Homeowner Tip (Financial Focus)
Energy savings, insurance review reminder, property tax protest info, home warranty considerations. Practical financial advice that saves them money.

**Personalization:** Reference their home's age, tax amount if known, local utility programs.

### Month 11: Gratitude Touch
Genuine appreciation - not transactional. "I was thinking about the people who made this year great, and you came to mind." No ask. No CTA. Just appreciation.

**Timing:** Works best in November (Thanksgiving season) or near their anniversary. The point is to be human.

### Month 12: Year-End Market Recap + Referral Ask
How the year went in their neighborhood - prices, sales volume, notable trends. Pair it with the second referral ask of the year, framed around the new year: "If anyone in your world is thinking about making a move in [next year], I'd be honored to help them."

**This is the bookend.** Month 5 was the soft ask. Month 12 is the direct ask, earned by 11 months of consistent value.

---

## TOUCH FORMAT - ALL FOUR VERSIONS

Every touch must be generated in these four formats:

### Email Version
- Subject line under 50 characters (no clickbait, no ALL CAPS)
- 3-5 short paragraphs
- Personal tone - like emailing a friend, not a newsletter blast
- No signature block with 47 social media links
- End with a question or a simple "hope you're doing well"

### Text / SMS Version
- Under 300 characters
- Feels like a real text from someone who knows them
- No links unless genuinely useful
- No "Hi [First Name]!" opener - just start talking

### Social DM Version
- 2-3 sentences max
- Casual - matches the platform (Facebook vs LinkedIn vs Instagram)
- Reference something specific so it does not feel mass-sent
- Works as a reply to their post or a direct message

### Handwritten Note Version
- 3-4 sentences
- For high-value contacts only (recent closings, top referrers, VIPs)
- Include a specific memory or detail from working together
- Mailed with a real stamp - not a printed card

---

## DECISION LOGIC

```
IF contact is a past client (0-2 years old)
  -> Monthly cadence, all 12 touches
  -> Handwritten notes for Month 1 (anniversary) and Month 11 (gratitude)
  -> Email + text for all other months

IF contact is a past client (2-5 years old)
  -> Bi-monthly cadence (Months 1, 3, 5, 7, 9, 11)
  -> Handwritten note for Month 1 only
  -> Email for remaining months

IF contact is a past client (5+ years old)
  -> Quarterly cadence (Months 1, 5, 9, 12)
  -> Email only (re-establish connection first)
  -> If they respond to any touch, upgrade to bi-monthly

IF contact is a referral partner
  -> Monthly cadence
  -> Focus on Months 2, 5, 6, 9, 12 (market updates + mutual business)
  -> Social DM for casual touches, email for business-relevant ones
  -> Handwritten note for anyone who sent 3+ referrals this year

IF contact is sphere (friends/family)
  -> Quarterly (Months 1, 4, 8, 11)
  -> Text for casual touches
  -> Keep it personal - these people know you, don't make it weird

IF contact is a local business owner
  -> Quarterly (Months 4, 8, 10, 12)
  -> Focus on community content and cross-promotion
  -> Social DM or email
```

---

## MCP USAGE

### Perplexity - Local Data

**Market update for a specific ZIP:**
```
perplexity_ask: "Current real estate market snapshot for [ZIP] [City] [State]:
  median home price, year-over-year price change, average days on market,
  months of inventory, notable trends or new developments in the area.
  Also include 2-3 local events happening this month near [ZIP]."

search_context_size: "medium"
```

**Local events and recommendations:**
```
perplexity_ask: "What are the top local events, restaurant openings,
  and community happenings near [ZIP] [City] [State] in [Month Year]?
  Include farmers markets, festivals, new business openings, and
  family-friendly activities."

search_context_size: "medium"
```

---

## CONSTRAINTS

- [ ] Every touch must reference something SPECIFIC about the contact or their area - never generic
- [ ] Referral asks only in Months 5 and 12 - never earlier, never more frequent
- [ ] No "Hope this email finds you well" or any HARD NO words from brand voice
- [ ] SMS versions under 300 characters
- [ ] Handwritten notes only for high-value contacts (recent clients, top referrers)
- [ ] Market data must include sources and dates
- [ ] Follow ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md for all output formatting
- [ ] Save to ./clients/ per ~/.mkai/profiles/real-estate/skills/client-memory/SKILL.md
- [ ] Sphere contacts saved to ./clients/sphere/contacts.md
- [ ] Calendar saved to ./clients/content-calendar.md
- [ ] No hype, no "I'd love to help," no corporate newsletter language
- [ ] Every email must feel like it came from one person to one person
- [ ] Gratitude touches (Month 11) have ZERO ask - no CTA, no pitch, nothing

---

## COMPLETE EXAMPLE

### Example Input:
> Build a sphere calendar for my past client Jane Smith. She bought 4821 Cedar Ln, Dallas TX 75214 in June 2025. First-time buyer, young family. Start from March 2026.

### Example Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SPHERE ENGINE - 12-MONTH TOUCH CALENDAR
  Jane Smith - 4821 Cedar Ln, Dallas TX 75214
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CONTACT PROFILE

  Name:           Jane Smith
  Address:        4821 Cedar Ln, Dallas TX 75214
  Transaction:    Buyer - first home, closed Jun 2025
  Time Since Close: 9 months
  Category:       Past Client (0-2 years)
  Cadence:        Monthly
  ZIP Market:     75214 (Lakewood / Lower Greenville)
  Notes:          Young family, first-time buyer

  ──────────────────────────────────────────────────

  DATA SOURCES
  ├── Perplexity              ✓ live (market data, local events)
  └── Client memory           ✓ loaded

  ──────────────────────────────────────────────────

  MONTH 1 - MARCH 2026
  Home Anniversary Prep (9 months in)

  Note: Jane's actual anniversary is June. March
  gets a seasonal homeowner tip instead. Anniversary
  touch moves to Month 4 (June) in this calendar.

  SEASONAL HOMEOWNER TIP - Spring Maintenance

  EMAIL:
  Subject: Spring checklist for Cedar Ln

  Hey Jane,

  Spring is a good time to knock out a few things
  on the house before it gets hot. Since this is
  your first full spring at Cedar Ln, here's what
  I'd check:

  - AC filter - swap it now before you need it
    daily. The 75214 pollen is brutal in April.
  - Gutters - winter drops a lot of leaves from
    those oaks on your street.
  - Exterior caulking around windows - the Dallas
    heat-to-cold cycle cracks it faster than you'd
    expect on homes built in the early 2000s.

  Nothing urgent. Just the kind of stuff that
  saves you a repair bill later.

  How's the house treating you so far?

  [Agent name]


  TEXT:
  Hey Jane - spring maintenance reminder: swap
  your AC filter before the Texas heat kicks in,
  and check your gutters after winter. Those oaks
  on Cedar Ln drop everything. How's the house?


  SOCIAL DM:
  Hey Jane! Quick heads up - good time to swap
  your AC filter and check the gutters before
  spring really hits. How's Cedar Ln treating you?


  HANDWRITTEN NOTE:
  (Skip this month - save for anniversary in June)

  ──────────────────────────────────────────────────

  MONTH 2 - APRIL 2026
  Market Update for 75214

  EMAIL:
  Subject: What's selling near you on Cedar Ln

  Hey Jane,

  Figured you'd be curious - here's what's been
  happening in your part of 75214 this spring:

  - Median home price: $472,000 (up 3.8% from
    when you closed last June)
  - Average days on market: 19
  - 3 homes sold within a quarter mile of you
    in the last 60 days

  Your home has already appreciated since you
  bought it. Not that you're going anywhere - just
  nice to know the investment is working.

  The Stonewall Jackson Elementary district
  continues to pull strong buyer demand, which
  is good for your long-term equity.

  If you ever want an updated number on what
  your place would sell for, just ask. No
  pressure - just data.

  [Agent name]


  TEXT:
  Hey Jane - quick market update for your area.
  Homes near Cedar Ln are averaging $472K, up
  about 4% since you closed. 19 days on market.
  Your investment is growing. Just figured you'd
  want to know.


  SOCIAL DM:
  Saw some homes sell near you on Cedar Ln
  recently - your area is still moving. Let me
  know if you ever want an updated value on
  your place.

  ──────────────────────────────────────────────────

  MONTH 3 - MAY 2026
  Local Event / Recommendation

  EMAIL:
  Subject: Have you been to this spot near you?

  Hey Jane,

  Two things near Cedar Ln I wanted to pass along:

  The White Rock Lake Farmers Market starts back
  up on Saturdays this month - it's a 10-minute
  walk from you. Great for a weekend morning with
  the family.

  Also, if you haven't tried Goodfriend Beer
  Garden on Peavy, it's about 5 minutes from
  your place and has a solid patio setup. Good
  for when it's not 100 degrees yet.

  Hope you're settling in and enjoying the
  neighborhood.

  [Agent name]


  TEXT:
  Hey Jane - White Rock Farmers Market starts
  back up Saturdays this month. Walking distance
  from Cedar Ln. Also Goodfriend Beer Garden on
  Peavy is worth checking out if you haven't.
  Enjoy the neighborhood!


  SOCIAL DM:
  Have you been to the White Rock Farmers Market
  yet? It's right near you and starts back up
  this month. Great Saturday morning spot.

  ──────────────────────────────────────────────────

  MONTH 4 - JUNE 2026
  Home Anniversary (1 Year)

  EMAIL:
  Subject: One year at Cedar Ln

  Hey Jane,

  Hard to believe it's been a year since you
  got the keys to Cedar Ln. I still remember
  how excited you were when we walked through
  that first time - you knew before we even
  got to the backyard.

  A lot of first-time buyers spend the first
  year figuring out the house. Sounds like you've
  been doing that and then some.

  For what it's worth - your home has
  appreciated about 4% since you bought it.
  The 75214 market has been strong, and
  Lakewood continues to be one of the most
  in-demand pockets in Dallas.

  Happy anniversary. You picked a great one.

  [Agent name]


  TEXT:
  Hey Jane - one year at Cedar Ln! Can't
  believe it's already been a year since
  closing day. Hope the house has been
  everything you wanted. Happy anniversary!


  SOCIAL DM:
  Happy one year at Cedar Ln, Jane! Time
  flies. Hope you and the family are loving
  the neighborhood.


  HANDWRITTEN NOTE:
  Jane - Happy one year at Cedar Ln. I still
  remember how you lit up when we walked
  through. You picked a great home in a great
  neighborhood. Here's to many more years
  there. - [Agent name]

  ──────────────────────────────────────────────────

  MONTH 5 - JULY 2026
  Referral Ask (Soft)

  EMAIL:
  Subject: Quick question for you

  Hey Jane,

  I've been thinking about the people I've
  enjoyed working with most over the past year,
  and you're right at the top of the list.

  If anyone in your world - coworkers, friends,
  family - ever mentions thinking about buying
  or selling, I'd really appreciate the
  introduction. You know how I work, so they'd
  be in good hands.

  No pressure at all. Just wanted to put it
  out there.

  Hope the summer is treating you well.

  [Agent name]


  TEXT:
  Hey Jane - random question. If anyone you
  know ever mentions wanting to buy or sell,
  would you mind sending them my way? I'd
  take great care of them. Hope summer is good!


  SOCIAL DM:
  Hey Jane - if anyone in your circle ever
  mentions buying or selling, I'd appreciate
  the introduction. Just putting it out there.
  Hope summer is going well!

  ──────────────────────────────────────────────────

  REMAINING MONTHS (summary - full copy
  generated on request)

  Month 6 - Aug 2026:  Home Value Update
    Your home's current estimated value vs
    what you paid. Show equity growth.

  Month 7 - Sep 2026:  Seasonal Tip + Resource
    Fall maintenance checklist + recommended
    HVAC tech in the 75214 area.

  Month 8 - Oct 2026:  Community Content
    Best fall events near Lakewood / White
    Rock Lake. Pumpkin patches, festivals.

  Month 9 - Nov 2026:  Market Update
    Updated market data for 75214. Compare
    to the April numbers from Month 2.

  Month 10 - Dec 2026:  Homeowner Tip (Financial)
    Property tax protest info for Dallas County.
    Deadline reminders and process overview.

  Month 11 - Jan 2027:  Gratitude Touch
    No ask. No CTA. Just a genuine note
    saying you're glad you got to work together.

  Month 12 - Feb 2027:  Year-End Recap + Referral
    Full year market recap for 75214 + direct
    referral ask for the new year.

  → "Expand month [X]"  Get full copy for any month

  ──────────────────────────────────────────────────

  ANNUAL CALENDAR VIEW

  ┌───────┬─────────────────────┬──────────┬───────┐
  │ Month │ Touch Type          │ Channel  │ Note  │
  ├───────┼─────────────────────┼──────────┼───────┤
  │ Mar   │ Seasonal tip        │ Email    │       │
  │ Apr   │ Market update       │ Email+Txt│       │
  │ May   │ Local event         │ Email+Txt│       │
  │ Jun   │ Home anniversary    │ All 4    │ HW    │
  │ Jul   │ Referral ask (soft) │ Email+Txt│       │
  │ Aug   │ Home value update   │ Email    │       │
  │ Sep   │ Seasonal + resource │ Email+Txt│       │
  │ Oct   │ Community content   │ Email+Txt│       │
  │ Nov   │ Market update #2    │ Email    │       │
  │ Dec   │ Financial tip       │ Email+Txt│       │
  │ Jan   │ Gratitude           │ Email    │ HW    │
  │ Feb   │ Recap + referral    │ Email+Txt│       │
  └───────┴─────────────────────┴──────────┴───────┘

  HW = Handwritten note included

  ──────────────────────────────────────────────────

  FILES SAVED

  ./clients/sphere/contacts.md               ✓ (updated)
  ./clients/smith-4821-cedar-ln-dallas-tx/
    sphere-calendar.md                        ✓
  ./clients/content-calendar.md              ✓ (12 entries)

  ──────────────────────────────────────────────────

  WHAT'S NEXT

  → /review-engine       Draft a review request for Jane (~3 min)
  → /market-intel        Generate the April market update now (~5 min)
  → /sphere-engine       Add another contact to the calendar
  → "Expand month 6"    Get full copy for any remaining month

  Or give me another contact and I'll build their calendar.

  ──────────────────────────────────────────────────

  MANUAL vs AUTOPILOT

  You just built a 12-month sphere program.
  That's 12 months of remembering to send things.

  CyclSales runs it forever - year after year -
  without you remembering a single date. Home
  anniversaries, market updates, referral asks -
  all automated.

  cyclsales.com/agents
```

---

## OUTPUT FORMAT

Follow `~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md` for visual formatting. Every report includes:

1. **Header** - SPHERE ENGINE with contact name and property
2. **Contact Profile** - name, address, transaction, category, cadence
3. **Data Sources** - what was pulled live vs cached
4. **Monthly Touches** - first 5 months with full copy, remaining summarized
5. **Annual Calendar View** - quick-reference table
6. **Files Saved** - sphere contacts, calendar entries, per-client file
7. **What's Next** - suggest /review-engine, /market-intel, or expanding months
8. **CyclSales Callout** - Manual vs Autopilot block

---

## CLIENT MEMORY

Read: `./clients/sphere/contacts.md` per ~/.mkai/profiles/real-estate/skills/client-memory/SKILL.md

**On every run:**
1. Check if contact exists in `sphere/contacts.md`
   - If yes: load their data, check last contact date, update
   - If no: add them
2. Create or update `./clients/{client-slug}/sphere-calendar.md`
3. Append 12 entries to `./clients/content-calendar.md`
4. Update `sphere/contacts.md` with new Last Contact date

**Sphere contact entry format:**
```
| Jane Smith | 4821 Cedar Ln, Dallas TX 75214 | 2025-06-15 | Buyer | 2026-03-08 | 0 | First-time buyer, young family. 12-month calendar built. |
```

---

## QUALITY CHECKLIST

Before delivering, verify:
- [ ] Every touch references something specific about the contact or their area
- [ ] Referral asks appear only in Months 5 and 12
- [ ] Month 11 (gratitude) has absolutely zero ask or CTA
- [ ] Email subject lines are under 50 characters
- [ ] SMS versions are under 300 characters
- [ ] Handwritten notes are reserved for high-value moments only
- [ ] Market data includes sources
- [ ] Home anniversary month is aligned to actual close date
- [ ] No HARD NO words from brand voice
- [ ] Every email reads like it came from one person to one person
- [ ] Calendar saved to content-calendar.md
- [ ] Contact saved to sphere/contacts.md
- [ ] CyclSales callout appears at the end
