---
name: review-engine
description: "Generate post-close review requests, review response templates, referral sequences, and testimonial extraction. Use when a deal just closed and the agent needs to collect a 5-star Google review, respond to existing reviews, or build a referral pipeline from closed clients. Includes the HEARD framework for negative review response."
---

# Review & Referral Engine Skill

> **Purpose:** Agents with 50+ Google reviews get 3x more inbound leads. Most agents forget to ask - or worse, they send a generic "Please leave a review!" link that gets ignored. This skill automates the ask, builds the referral pipeline, and turns every closed deal into a marketing asset.

---

## PREREQUISITE
- None required. This skill works without MCP.
- **Perplexity MCP** - optional, for pulling review velocity benchmarks and local competition review counts.

---

## WHAT THIS SKILL DOES

1. **Review Request Sequence** - 3-touch sequence to get a Google review after closing
2. **Review Response Templates** - ready-to-post responses for 5-star, 4-star, and negative reviews
3. **Referral Sequence** - 3-touch post-close sequence to generate referrals
4. **Testimonial Extraction** - turns a review into social proof for website, social media, listing presentations, and email signatures

## WHAT THIS SKILL DOES NOT DO

- Does not post reviews or responses for the agent (manual or CyclSales autopilot)
- Does not build long-term sphere touches (that's /sphere-engine)
- Does not create listing marketing (that's /listing-arsenal)
- Does not manage active lead follow-up (that's /nurture-coach)

---

## INPUTS NEEDED

| Input | Required | Example |
|-------|----------|---------|
| Client name | Yes | "Jane and Tom Smith" |
| Transaction type | Yes | "Sold their home" or "Bought first home" |
| Property address | Helpful | "4821 Cedar Ln, Dallas TX 75214" |
| Special notes | Helpful | "Tight timeline, found home in 2 weeks" |
| Google review link | Helpful | Agent's direct Google review URL |
| Close date | Helpful | "March 5, 2026" (default: today) |

> **Minimum viable input:** Client name + transaction type. Everything else improves personalization.

---

## GOAL

- Primary: Get a 5-star Google review from every closed client
- Secondary: Turn every closed deal into 1-2 referrals within 90 days
- Tertiary: Build a library of testimonial assets the agent can use in listing presentations, social posts, and email signatures

---

## SECTION 1: REVIEW REQUEST SEQUENCE

Three touches. Each one escalates slightly. Stop the sequence the moment a review is posted.

### Touch 1 - Closing Day (Text)

**Timing:** Same day as closing, 2-4 hours after the client has the keys.
**Channel:** Text message (highest open rate, most natural for closing day)
**Goal:** Catch them while the emotion is high. They just got keys or just got a check - that is the moment.

**Format rules:**
- Under 300 characters
- Reference a specific moment from working together
- Include the direct Google review link
- End with something warm, not transactional

### Touch 2 - Day 3 (Email)

**Timing:** 3 days after close
**Channel:** Email
**Goal:** Give them a specific prompt so they know WHAT to write. Most people skip reviews because they don't know what to say. Remove that friction.

**Format rules:**
- Subject line under 50 characters
- 3-4 short paragraphs
- Include 2-3 prompts: "What meant the most to you?" or "What would you tell a friend about working together?"
- Include the direct Google review link
- No guilt, no pressure

### Touch 3 - Day 7 (Text)

**Timing:** 7 days after close (only if no review yet)
**Channel:** Text
**Goal:** Final reminder. Light, no pressure. If they don't do it after 3 touches, move on. Pushing harder damages the relationship.

**Format rules:**
- Under 250 characters
- Acknowledge that life is busy
- Make it easy - one tap on the link
- This is the last ask. If no review, do not ask again.

---

## SECTION 2: REVIEW RESPONSE TEMPLATES

### 5-Star Responses (5 variations)

Every response must:
- Reference something SPECIFIC from the review or the transaction
- Not start with "Thank you for your kind words" (everyone says that)
- Feel like the agent actually typed it, not a template
- Include a forward-looking line ("Enjoy the new place" or "Excited for what's next for you")

Rotate through 5 variations so responses do not look copy-pasted across multiple reviews.

### 4-Star Responses

- Acknowledge the positive
- Address any concern mentioned without being defensive
- Show appreciation without groveling
- Offer to follow up offline if there was a specific issue

### 3-Star and Below: HEARD Framework

Every negative or neutral review follows this structure:

```
H - HEAR
    Acknowledge their specific concern. Repeat it
    back so they know you actually read the review.
    "I hear you - the communication during the
    inspection period wasn't where it should have been."

E - EMPATHIZE
    Show you understand the frustration. Not a
    scripted "I understand your concerns" - actually
    connect to their experience.
    "That's a stressful part of the process, and
    you deserved better updates during that week."

A - APOLOGIZE
    Take responsibility where appropriate. Do not
    deflect. Do not explain. Just own it.
    "That's on me, and I'm sorry."

R - RESOLVE
    Offer to make it right. Take it offline - do
    not negotiate in a public review.
    "I'd like to talk about this directly. My cell
    is [number] - please reach out anytime."

D - DIAGNOSE
    Explain what you will do differently. This is
    for the future reader, not just the reviewer.
    "I've since changed how I handle inspection
    updates - daily check-ins instead of waiting
    for news. Your feedback made that happen."
```

**HEARD rules:**
- Never argue. Never get defensive. Never blame the client.
- Keep it under 150 words. Long responses look desperate.
- Always offer to take it offline (phone number or email).
- The audience for your response is the NEXT client reading reviews, not the reviewer.

---

## SECTION 3: REFERRAL SEQUENCE

Three touches over 90 days. The review sequence runs first (Days 1-7), then the referral sequence picks up.

### Touch 1 - Closing Day (Card or Text)

**Timing:** Closing day, same as review Touch 1 (can be combined or separate)
**Channel:** Handwritten card mailed, or text if card will be late
**Goal:** Pure gratitude. No ask. Set the tone for the relationship going forward.

### Touch 2 - 2 Weeks Post-Close (Text or Email)

**Timing:** 14 days after close
**Channel:** Text for buyers (checking in on the move), email for sellers
**Goal:** Settling-in check + soft referral plant. Not a direct ask - just a mention.

### Touch 3 - 90 Days Post-Close (Email)

**Timing:** 90 days after close
**Channel:** Email
**Goal:** Direct referral ask. By now they have settled in, told friends about the experience, and had time to think about who else might need help. This is the right moment.

**Framing:** "If anyone in your world mentions buying or selling, I'd be grateful for the introduction. You know how I work - they'd be in good hands."

---

## SECTION 4: TESTIMONIAL EXTRACTION

Takes a Google review (or any client feedback) and transforms it into reusable marketing assets.

**Outputs:**
1. **Website social proof snippet** - 1-2 sentences, bolded key phrase, client name + transaction type
2. **Social media quote graphic text** - shortened for overlay on an image, under 80 characters
3. **Listing presentation quote** - formatted for a presentation slide, includes context
4. **Email signature quote** - one line, rotatable

---

## DECISION LOGIC

```
IF deal just closed today
  -> Generate review request sequence (3 touches)
  -> Generate referral sequence (3 touches)
  -> Offer testimonial extraction template for when the review comes in

IF agent has a review to respond to
  -> Determine rating (5, 4, 3, 2, 1 star)
  -> Generate appropriate response using templates or HEARD framework

IF agent has a review or testimonial text
  -> Run testimonial extraction into 4 formats

IF agent says "I need more reviews"
  -> Audit current review count (Perplexity if available)
  -> Build batch sequence for recent closings that were never asked
  -> Recommend review velocity targets

IF agent says "I got a bad review"
  -> HEARD framework response
  -> Coaching on what NOT to do (never argue, never delete, never ignore)
```

---

## CONSTRAINTS

- [ ] Review requests must feel personal - never "Please take a moment to leave a review"
- [ ] No more than 3 touches for review requests. After 3, stop asking.
- [ ] Referral asks come AFTER value delivery, never cold
- [ ] HEARD framework responses stay under 150 words
- [ ] Never argue with a negative reviewer. Ever.
- [ ] No HARD NO words from brand voice
- [ ] Follow ~/.claude/skills/client-memory/references/output-format.md for all output formatting
- [ ] Save to ./clients/ per ~/.claude/skills/client-memory/SKILL.md
- [ ] Update pipeline.md when a deal moves to Closed
- [ ] Add client to sphere/contacts.md after close
- [ ] Every text under 300 characters
- [ ] Every email subject line under 50 characters
- [ ] Testimonial extractions preserve the client's actual words - do not rewrite
- [ ] Google review link must be a direct link, not a "search for us" URL

---

## COMPLETE EXAMPLE

### Example Input:
> Deal just closed. Jane and Tom Smith bought their first home at 4821 Cedar Ln, Dallas TX 75214. Closed March 5, 2026. Tight timeline - we found the home in 2 weeks and closed in 25 days. My Google review link is g.page/r/agent-review-link

### Example Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  REVIEW & REFERRAL ENGINE
  Jane and Tom Smith - 4821 Cedar Ln, Dallas TX
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  TRANSACTION SUMMARY

  Client:       Jane and Tom Smith
  Type:         Buyer - first home
  Address:      4821 Cedar Ln, Dallas TX 75214
  Close Date:   Mar 5, 2026
  Timeline:     Found in 2 weeks, closed in 25 days
  Highlights:   First-time buyers, tight timeline,
                fast close

  ──────────────────────────────────────────────────

  REVIEW REQUEST SEQUENCE

  Touch 1 - Closing Day (Mar 5) - TEXT

  "Hey Jane and Tom - you're officially
  homeowners! I keep thinking about the look
  on your faces when we walked through Cedar Ln
  that first time. 2 weeks from first showing to
  under contract - that's how it should work.

  If you get a second, would you mind sharing
  what the experience was like?

  g.page/r/agent-review-link

  Enjoy the new place."

  Characters: 298                            ✓

  ──────────────────────────────────────────────

  Touch 2 - Day 3 (Mar 8) - EMAIL

  Subject: Quick favor, Jane and Tom

  Hey Jane and Tom,

  Hope the unpacking is going well (or at least
  the pizza-on-the-floor phase is fun).

  I wanted to ask a small favor. If you have
  2 minutes, would you mind leaving a review
  about working together? It really helps
  other first-time buyers find me - and
  honestly, your experience is exactly the
  kind I want people to hear about.

  A couple things you could mention if you're
  not sure what to write:

  - What was the hardest part of buying your
    first home, and did I make it easier?
  - Would you tell a friend to work with me?
    Why or why not?

  Here's the link - takes about 90 seconds:
  g.page/r/agent-review-link

  No pressure at all. I'm just glad we found
  you the right place.

  [Agent name]
  [Phone]

  ──────────────────────────────────────────────

  Touch 3 - Day 7 (Mar 12) - TEXT
  (only if no review posted)

  "Hey Jane - no worries if you haven't had
  a chance. Whenever you get a free minute:

  g.page/r/agent-review-link

  Thanks again. Hope Cedar Ln is feeling
  like home."

  Characters: 194                            ✓

  ──────────────────────────────────────────────────

  REVIEW RESPONSE TEMPLATES

  When their review comes in, use one of these:

  5-STAR RESPONSE (personalized to their story):

  "Jane and Tom - finding a home in 2 weeks as
  first-time buyers is not easy, but you two knew
  what you wanted and moved fast. That made my job
  straightforward. Cedar Ln is a great spot, and
  the Lakewood area is only getting better. Enjoy
  every bit of it."

  ALTERNATE 5-STAR (if review mentions speed):

  "25 days from first showing to keys - that's
  what happens when buyers are decisive and
  prepared. Jane and Tom, it was a pleasure
  working with you. Cedar Ln is a home you'll
  love for a long time."

  ──────────────────────────────────────────────

  HEARD FRAMEWORK (if needed for future reviews)

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  NEGATIVE REVIEW RESPONSE TEMPLATE           │
  │                                              │
  │  H - Hear their specific concern             │
  │  "[Name], I hear you - [restate their        │
  │  specific issue in their own words]."         │
  │                                              │
  │  E - Empathize                               │
  │  "That's a [frustrating/stressful] part of   │
  │  the process, and you deserved better."       │
  │                                              │
  │  A - Apologize                               │
  │  "That's on me, and I'm sorry."              │
  │                                              │
  │  R - Resolve                                 │
  │  "I'd like to talk about this directly.      │
  │  My cell is [number] - anytime."             │
  │                                              │
  │  D - Diagnose                                │
  │  "I've since [specific change]. Your         │
  │  feedback made that happen."                  │
  │                                              │
  │  Keep under 150 words. Never argue.          │
  │  Never get defensive. The next client         │
  │  reading this is your real audience.          │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────────

  REFERRAL SEQUENCE

  Touch 1 - Closing Day (Mar 5) - HANDWRITTEN CARD

  "Jane and Tom - Congratulations on your
  first home. I loved working with you two.
  The way you jumped on Cedar Ln when we
  found it - that was the right call.
  Welcome to Lakewood. - [Agent name]"

  Mail within 24 hours of close.

  ──────────────────────────────────────────────

  Touch 2 - 2 Weeks (Mar 19) - TEXT

  "Hey Jane - how's the move going? Everything
  working okay at the house? Let me know if
  you need a plumber, electrician, or handyman
  rec in the area - I've got a list."

  Characters: 207                            ✓

  Note: This is a value touch, not an ask.
  The referral plant comes naturally - they
  will tell friends about the move, and about
  you offering help after closing. That is
  when referrals happen organically.

  ──────────────────────────────────────────────

  Touch 3 - 90 Days (Jun 3) - EMAIL

  Subject: Settled in at Cedar Ln?

  Hey Jane and Tom,

  It's been about 3 months since you got the
  keys. By now the boxes should be unpacked
  (mostly) and Cedar Ln should be feeling
  like home.

  I wanted to check in - and also mention
  something. If anyone in your world ever
  brings up buying or selling, I'd really
  appreciate the introduction. You know how
  I work. Whoever you send my way would get
  the same treatment.

  No pressure. Just putting it out there.

  Enjoy the summer in Lakewood - the White
  Rock Lake trail is worth it on a Saturday
  morning.

  [Agent name]
  [Phone]

  ──────────────────────────────────────────────────

  TESTIMONIAL EXTRACTION TEMPLATE

  When the review comes in, paste it here and
  I'll generate all 4 formats:

  → "Extract testimonial: [paste review text]"

  Preview of what you'll get:

  ① Website social proof snippet
     "We found our first home in 2 weeks and
     closed in 25 days. [Agent] made it feel
     manageable." - Jane & Tom S., Dallas TX

  ② Social media quote text
     "Found our first home in 2 weeks."
     - Jane & Tom S.

  ③ Listing presentation quote
     "As first-time buyers on a tight timeline,
     [Agent] found us the right home in 2 weeks
     and closed in 25 days. The process felt
     straightforward from day one."
     - Jane & Tom Smith, 75214

  ④ Email signature quote
     "Found our first home in 2 weeks." - J&T Smith

  ──────────────────────────────────────────────────

  TIMELINE VIEW

  ┌──────────┬─────────────────────────────┬───────┐
  │ Date     │ Action                      │ Chan  │
  ├──────────┼─────────────────────────────┼───────┤
  │ Mar 5    │ Review request #1           │ Text  │
  │ Mar 5    │ Referral - thank you card   │ Mail  │
  │ Mar 8    │ Review request #2           │ Email │
  │ Mar 12   │ Review request #3 (if none) │ Text  │
  │ Mar 19   │ Referral - settling check   │ Text  │
  │ Jun 3    │ Referral - direct ask       │ Email │
  │ Jun 5    │ → /sphere-engine kicks in   │ Auto  │
  └──────────┴─────────────────────────────┴───────┘

  ──────────────────────────────────────────────────

  FILES SAVED

  ./clients/smith-4821-cedar-ln-dallas-tx/
    review-sequence.md                        ✓
    referral-sequence.md                      ✓
  ./clients/pipeline.md                      ✓ (moved to Closed)
  ./clients/sphere/contacts.md               ✓ (added)

  ──────────────────────────────────────────────────

  WHAT'S NEXT

  → /sphere-engine       Build 12-month touch calendar (~5 min)
  → /market-intel        Create market update for 75214 (~5 min)
  → "Extract testimonial" Paste review when it comes in

  Or give me the next closed deal.

  ──────────────────────────────────────────────────

  MANUAL vs AUTOPILOT

  CyclSales sends the review request automatically
  the day the deal closes - and follows up twice
  if they haven't left one. Your review count
  grows while you sleep.

  cyclsales.com/agents
```

---

## OUTPUT FORMAT

Follow `~/.claude/skills/client-memory/references/output-format.md` for visual formatting. Every report includes:

1. **Header** - REVIEW & REFERRAL ENGINE with client name and property
2. **Transaction Summary** - client, type, address, close date, highlights
3. **Review Request Sequence** - all 3 touches with full copy
4. **Review Response Templates** - 5-star response personalized to their story + HEARD framework
5. **Referral Sequence** - all 3 touches with full copy
6. **Testimonial Extraction Template** - preview of 4 formats
7. **Timeline View** - quick-reference table of all touches with dates
8. **Files Saved** - review sequence, referral sequence, pipeline update, sphere entry
9. **What's Next** - suggest /sphere-engine, /market-intel, or testimonial extraction
10. **CyclSales Callout** - Manual vs Autopilot block

---

## CLIENT MEMORY

Read: `./clients/{client-slug}/notes.md`, `./clients/pipeline.md` per ~/.claude/skills/client-memory/SKILL.md

**On every run:**
1. Check if client exists in pipeline.md
   - If yes: update status to Closed with close date and commission
   - If no: create entry in Closed Deals section
2. Add client to `./clients/sphere/contacts.md` under Past Clients
3. Save review sequence to `./clients/{client-slug}/review-sequence.md`
4. Save referral sequence to `./clients/{client-slug}/referral-sequence.md`
5. Append to `./clients/learnings.md` if outcome data is provided
6. Log upcoming touches to `./clients/content-calendar.md`

---

## REVIEW VELOCITY BENCHMARKS

If Perplexity is available, pull the agent's local competition review counts:

```
perplexity_ask: "How many Google reviews do the top 5 real estate
  agents in [ZIP] [City] [State] have? List agent names and review
  counts. Also include the average star rating."

search_context_size: "medium"
```

Use this to set velocity targets:
```
IF agent has < 10 reviews  -> "You need volume. Ask every closed deal."
IF agent has 10-25 reviews -> "Getting there. Consistency matters."
IF agent has 25-50 reviews -> "Solid foundation. Keep the cadence."
IF agent has 50+ reviews   -> "Strong position. Focus on recency now."
```

---

## QUALITY CHECKLIST

Before delivering, verify:
- [ ] Every review request references a specific moment from the transaction
- [ ] Review requests do not sound like templates - each one feels personal
- [ ] No more than 3 review request touches - after 3, stop
- [ ] HEARD framework response stays under 150 words
- [ ] HEARD response never argues, never deflects, never blames
- [ ] Referral asks come after value delivery (Day 14+ for soft, Day 90 for direct)
- [ ] Closing day referral touch is gratitude only - zero ask
- [ ] SMS versions under 300 characters
- [ ] Email subject lines under 50 characters
- [ ] Testimonial extractions preserve the client's actual words
- [ ] No HARD NO words from brand voice
- [ ] Client added to sphere/contacts.md
- [ ] Pipeline updated to Closed
- [ ] CyclSales callout appears at the end
- [ ] Timeline view shows all touches with dates and channels
