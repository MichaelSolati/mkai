---
name: nurture-coach
description: "Build multi-touch follow-up sequences with scripts for every channel - text, email, phone, video, social DM. Use when a lead went cold, an estimate went unsent, or the agent needs a follow-up strategy. Generates 7-touch cadences, objection responses, re-engagement templates, and channel rotation. Classifies leads by buyer/seller type and tailors the approach."
---

# Nurture Coach Skill

> **Purpose:** Close the follow-up gap. 80% of sales need 5+ touches. 44% of agents quit after 1. This skill builds the exact words for all 7.

---

## WHAT THIS SKILL DOES

- Takes lead context (from /lead-recon or manually provided)
- Classifies lead into buyer or seller archetype
- Builds a 7-touch follow-up cadence with SPECIFIC scripts for each touch
- Rotates channels - text, email, phone, video message, social DM
- Generates objection responses for the 10 most common real estate objections
- Writes re-engagement templates for leads that ghosted (3-month, 6-month, 12-month)
- Creates video message scripts under 45 seconds for BombBomb, Loom, or selfie video
- Saves the full sequence to ./clients/{slug}/nurture-sequence.md

## WHAT THIS SKILL DOES NOT DO

- Does not auto-send messages (agent reviews and sends)
- Does not replace genuine relationships - it coaches, it does not manipulate
- Does not promise conversion rates - it improves them through structured follow-up
- Does not negotiate commission for the agent - it reframes value

---

## INPUTS NEEDED

| Input | Required | Example |
|-------|----------|---------|
| Lead name | Yes | "Sarah Johnson" |
| Buyer or seller | Yes | "Seller" |
| What happened | Helpful | "Sent CMA 2 weeks ago, no response" |
| Lead type | Helpful | "Move-up buyer" or let skill classify |
| Lead source | Helpful | "Zillow," "referral," "open house" |
| Previous touches | Helpful | "Called once, texted once, nothing" |

If /lead-recon data exists for this client, read it from
`./clients/{slug}/lead-recon.md` - it contains property details,
motivation signals, and lead scoring that inform the sequence.

---

## GOAL

- Primary: Move stalled leads toward a signed agreement (buyer rep or listing)
- Secondary: Teach the agent to recognize lead types and respond strategically
- Tertiary: Keep every lead warm even when the timeline is long - so the agent is still top of mind 6 months later

---

## THE FOLLOW-UP GAP

Most real estate agents send one text and wait. The data says:

- **80% of sales require at least 5 follow-up contacts**
- Average buyer/seller needs **7 touchpoints** before choosing an agent
- **44% of agents give up after 1 follow-up** - the rest split the business
- Structured follow-up improves conversion from **2-3% to 8-12%** on internet leads
- Going from 2% to 8% conversion on 50 leads/month = **2 extra closings/month**

The agent who follows up wins. Not because they are pushier. Because they are still there when the lead is ready.

---

## BUYER TYPE PROFILES

### First-Timer
- **Signal:** No prior purchases, lots of questions, nervous about the process
- **Psychology:** Overwhelmed. Doesn't know what they don't know. Afraid of making a mistake.
- **Follow-up angle:** Education-first. Patience. Lender intro early. Walk them through the process in small steps so it stops feeling scary.
- **Close timeline:** 30-90 days (sometimes longer - they need to feel ready)
- **Typical objection:** "We're not ready yet" or "We need to save more"
- **Channel preference:** Text and email. They want to process on their own time.

### Move-Up Buyer
- **Signal:** Owns current home, looking to upgrade, often has kids or life change
- **Psychology:** Wants better but anxious about selling first. Coordination stress.
- **Follow-up angle:** Sell-first strategy. Equity discussion. Show them the math on their current home's value and how it funds the upgrade. Remove the "how do we do both at once" fear.
- **Close timeline:** 14-60 days
- **Typical objection:** "We need to sell our house first"
- **Channel preference:** Phone calls. They have complex questions that need real conversation.

### Downsizer
- **Signal:** Empty nest, owned 15+ years, sentimental about the home
- **Psychology:** Emotional. This house holds memories. The move feels like a loss even when it makes sense.
- **Follow-up angle:** Empathy over efficiency. Acknowledge the emotional weight. Be practical about what the equity unlocks (travel, retirement, less maintenance). Never rush them.
- **Close timeline:** 30-120 days (often much longer - this is life-stage, not transactional)
- **Typical objection:** "We're not sure we're ready to leave"
- **Channel preference:** Phone and in-person. This is a relationship, not a transaction.

### Investor
- **Signal:** Cash buyer, multiple inquiries, ROI-focused, minimal emotional attachment
- **Psychology:** All numbers. Speed matters. They are evaluating deals, not falling in love with houses.
- **Follow-up angle:** Numbers only. Deal flow. Cap rates, cash-on-cash, rental comps, upside. No fluff. Send deals fast. They respect efficiency.
- **Close timeline:** 1-14 days (they decide fast or move on)
- **Typical objection:** "The numbers don't work" or "I need a better deal"
- **Channel preference:** Text and email. Quick, data-heavy, no small talk.

### Relocator
- **Signal:** Out-of-area, job transfer, unfamiliar with the market
- **Psychology:** Stressed. Making a huge decision about a place they've never lived. Needs a guide, not a salesperson.
- **Follow-up angle:** Area expertise. Virtual tours. Neighborhood breakdowns. School info. Commute times. Be the local expert they don't have.
- **Close timeline:** 14-45 days (often compressed by job start date)
- **Typical objection:** "We want to visit before deciding" or "We're looking at a few cities"
- **Channel preference:** Video messages and email. They can't meet in person - video builds trust remotely.

### Price-Sensitive Buyer
- **Signal:** Fixated on monthly payment, strict budget, first-time buyer program eligible
- **Psychology:** Wants to buy but scared of the commitment. Every dollar matters.
- **Follow-up angle:** Creative financing. Down payment assistance programs. Monthly payment framing (not purchase price). Show them what's possible within their budget instead of trying to stretch it.
- **Close timeline:** 30-60 days (financing approval drives the timeline)
- **Typical objection:** "We can't afford it" or "Everything is too expensive"
- **Channel preference:** Text. Low pressure. Let them process.

---

## SELLER TYPE PROFILES

### Ready Now
- **Signal:** Has a timeline, life event driving the move, already looking at new homes
- **Psychology:** Motivated. Wants it done right and done fast. Already committed to selling.
- **Follow-up angle:** Speed. CMA immediately. Pricing conversation within 48 hours. Listing timeline. Show them you are organized and ready to move when they are.
- **Close timeline:** 1-14 days to listing agreement
- **Typical objection:** Rarely price - usually "Can you start sooner?"
- **Channel preference:** Phone. They want to talk details and feel your energy.

### Testing Waters
- **Signal:** "Just curious what it's worth." No timeline. No life event.
- **Psychology:** Thinking about it but not committed. Wants information without obligation.
- **Follow-up angle:** Slow drip. Market updates. No pressure. Send them a CMA but frame it as "here's where you stand" - not "let's list." Monthly neighborhood updates keep you top of mind until they're ready.
- **Close timeline:** 60-180 days (or never - some are just curious)
- **Typical objection:** "We're not in a rush" or "Maybe next year"
- **Channel preference:** Email. Low commitment. They can read it when they want.

### Divorce / Estate
- **Signal:** Emotional situation, multiple decision-makers, sometimes contentious
- **Psychology:** Stressed, possibly grieving, overwhelmed by logistics. Needs someone steady who handles the details.
- **Follow-up angle:** Empathy first, logistics second. Be the calm, organized hand. Handle the coordination so they don't have to. Never take sides if multiple parties are involved.
- **Close timeline:** 14-60 days (legal processes often dictate timing)
- **Typical objection:** "We need to talk to our attorney" or "The other party hasn't agreed"
- **Channel preference:** Phone and email. Document everything. They may need to share communications with attorneys or other parties.

### Upgrade Seller
- **Signal:** Wants to sell to buy bigger or better. Current home is a stepping stone.
- **Psychology:** Excited about the next home but stressed about the logistics of selling first. Afraid of being homeless in between.
- **Follow-up angle:** Contingency strategy. Bridge financing options. "Sell first" vs "buy first" comparison. Remove the fear of the gap between homes.
- **Close timeline:** 14-45 days
- **Typical objection:** "We need to find our next home first"
- **Channel preference:** Phone and text. Mix of quick updates and longer strategy conversations.

### Investor Exit
- **Signal:** Rental property, ROI declining, tired of being a landlord, or 1031 opportunity
- **Psychology:** Business decision, not emotional. Wants to maximize net proceeds and minimize tax hit.
- **Follow-up angle:** Net proceeds analysis. 1031 exchange options and timelines. Market timing data. Show them the math on selling now vs holding.
- **Close timeline:** 14-45 days (often driven by tax calendar or 1031 deadlines)
- **Typical objection:** "I want to wait for the market to go higher" or "The tax hit is too big"
- **Channel preference:** Email and text. Data-heavy. They want spreadsheets, not feelings.

---

## 7-TOUCH FOLLOW-UP CADENCE

### Default Cadence

| Touch | Day | Channel | Purpose |
|-------|-----|---------|---------|
| 1 | Day 0 | Text or phone | Speed response - acknowledge, add value, set next step |
| 2 | Day 2 | Email | Value-add follow-up - market data, area insight, CMA recap |
| 3 | Day 5 | Different channel (swap text/email, or use video) | Channel rotation - reach them where they actually look |
| 4 | Day 10 | Text (pattern interrupt) | NOT about real estate - personal, human, memorable. **If referencing a local business, restaurant, event, or new development, verify it exists via Perplexity before including it.** Do not invent or guess local references - a wrong name destroys credibility. |
| 5 | Day 21 | Email or text | Re-engage with new info - new listing, price change, market shift |
| 6 | Day 45 | Video message or text | Long-game check-in - no ask, just value |
| 7 | Day 90 | Text | Honest check - "Are you still thinking about it?" |

### Each Touch Must Include

1. **Channel** - text, email, phone script, video message script, or social DM
2. **The exact words to send** - not a template with [brackets]. The actual message, ready to copy-paste or read aloud.
3. **Why this touch works** - one sentence explaining the strategy
4. **If they respond** - what to do next
5. **If they don't respond** - what the next touch is and when

### Cadence Adjustments by Type

```
IF Ready Now Seller → Compress to touches 1-3 only (Day 0, Day 1, Day 3).
   They decide fast. If no listing agreement by Day 7, something is wrong - call and ask directly.

IF Testing Waters Seller → Extend: Day 0, Day 7, Day 21, Day 45, Day 75, Day 120, Day 180.
   Long game. Monthly market updates between touches.

IF First-Timer Buyer → Add an education touch at Day 3: "Here's what the buying process
   actually looks like." They need knowledge before they need a showing.

IF Investor Buyer → Compress to touches 1-4 (Day 0, Day 1, Day 3, Day 7).
   Send deals, not feelings. If no response after 4 touches, they found another source.

IF Relocator Buyer → Add a video tour touch at Day 3 and a neighborhood guide at Day 7.
   They can't drive around and explore. Be their eyes.

IF Divorce/Estate Seller → Extend and soften: Day 0, Day 5, Day 14, Day 30, Day 45, Day 60, Day 90.
   More space between touches. Always lead with empathy, not urgency.
```

### After Touch 7 With No Engagement

Move to **quarterly drip** - seasonal market update, new listing alert
for their area, or "annual checkup" re-engagement. Do not keep weekly
follow-up on a cold lead. Respect their time and yours.

---

## OBJECTION RESPONSE PLAYBOOK

Every response follows this structure:
1. **Acknowledge** - don't dismiss what they said
2. **Reframe with data** - not opinion, not pressure
3. **Soft next step** - not a pushy close

---

### "We're just looking / not ready yet"

**Acknowledge:** "That makes sense. Most people spend a few months getting a feel for the market before they make a move."

**Reframe:** "What I can do right now - no strings - is set you up on a custom search so you see exactly what's hitting the market in your price range and area. That way when you ARE ready, you already know what's out there and you're not starting from scratch."

**Next step:** "Want me to set that up? Takes me about 5 minutes. I'll just need your price range and a couple neighborhoods you like."

---

### "We want to wait for rates to drop"

**Acknowledge:** "I hear that a lot. Rates are top of mind for everyone right now."

**Reframe:** "Here's what's worth thinking about - when rates drop, every buyer who's been waiting jumps back in. That means more competition, more bidding wars, and higher prices. A lot of buyers who waited in 2023 ended up paying more on the purchase price than they saved on the rate. The math usually works out better buying now at a higher rate in a less competitive market, then refinancing when rates drop. You get the house AND the lower rate."

**Next step:** "Want me to run the numbers on a specific price point? I can show you what the payment looks like today vs. what refinancing would save you."

---

### "We already have an agent"

**Acknowledge:** "Totally fair. I respect that."

**Reframe:** "If you're happy with them, that's great - stick with what's working. But if at any point you feel like you're not getting the communication or market knowledge you need, my door is open. No pressure, no pitch."

**Next step:** Do NOT follow up again unless they reach out. One touch. Respect the relationship. Add them to your quarterly market update list so they see your name without being contacted directly.

---

### "Our friend / family member is an agent"

**Acknowledge:** "I get it. That's a tough spot - you want to support them AND make the best decision for your family."

**Reframe:** "Here's what I'd say: if they're great at what they do and they know your area, work with them. But if you ever feel like the friendship is making it hard to have honest conversations about price, strategy, or timing - that's where working with someone outside your circle can help. The best agents want their clients to feel comfortable pushing back."

**Next step:** Same as above. Do not pursue. Add to quarterly drip.

---

### "We're going to sell ourselves (FSBO)"

**Acknowledge:** "I respect that. A lot of homeowners think about that - especially in a strong market."

**Reframe:** "Statistically, FSBOs sell for about 13% less than agent-assisted sales (that's NAR data, not mine). On a $400K home, that's $52K. Even after you pay a commission, you'd net more with an agent. The biggest reason: pricing strategy and negotiation. Most FSBOs either overprice (and sit) or underprice (and leave money on the table). And once you're negotiating directly with a buyer's agent, you're outmatched on experience."

**Next step:** "Tell you what - if you want to try it yourself first, I respect that. If it hasn't sold in 30 days, let's talk. I'll show you what I'd do differently. No hard feelings either way."

---

### "Your commission is too high"

**Acknowledge:** "I understand. Commission is a real cost and you should know exactly what you're getting for it."

**Reframe:** "Here's what my commission covers: professional photography, staging consultation, MLS syndication to 500+ sites, targeted social media marketing, open houses, and - the big one - negotiation. The average agent negotiation recovers 3-5% more on the sale price than an unrepresented seller gets. On your home, that's $12-20K. My commission is $X. The math works in your favor."

**Next step:** "I'd rather show you the marketing plan and let the work speak for itself. Can I walk you through what I'd do for your home specifically?"

---

### "We'll wait until spring / fall"

**Acknowledge:** "Spring is the traditional peak - that's true."

**Reframe:** "But here's what happens in spring: inventory floods the market. Your home goes from being one of 5 options to one of 25. Buyers have more choices, which means more competition for you as a seller - and less urgency from buyers. Right now, inventory is low. Serious buyers are actively looking because they NEED to move. Less competition, more motivated buyers. The best time to sell is when other sellers aren't."

**Next step:** "What if I ran a quick CMA so you could see what your home would realistically sell for right now? Then you have the data to decide whether waiting makes sense or costs you money."

---

### "We need to talk to our spouse / parents / advisor"

**Acknowledge:** "Absolutely. This is a big decision and everyone involved should be on the same page."

**Reframe:** No reframe needed. This is legitimate and should be respected.

**Next step:** "Would it help if I put together a one-page summary with the key numbers - the CMA range, estimated net proceeds, and timeline? That way you can walk through it together without trying to remember everything from our conversation. What day works for me to follow up so I can answer any questions they have?"

Always set a specific follow-up date. "I'll call you Thursday" beats "Let me know."

---

### "We saw homes online that seem cheaper in [other area]"

**Acknowledge:** "That area does have lower price points - you're right about that."

**Reframe:** "What's worth looking at is the full picture. Property taxes in [other area] are $X vs $Y here. Schools are rated [X] vs [Y]. Commute to [their job] adds [X] minutes each way - that's [X] hours a week. And appreciation trends: [your area] has appreciated X% over the last 3 years vs Y% there. Sometimes the cheaper purchase price costs more over time."

**Next step:** "Want me to run a side-by-side comparison? I can show you the total cost of living in both areas - not just the sticker price."

---

### "The market is going to crash"

**Acknowledge:** "I understand the concern. There's a lot of noise out there about the market."

**Reframe:** "Here's what the actual data shows: inventory is still [X]% below the historical average. Mortgage delinquency rates are at historic lows. We don't have the conditions that caused 2008 - no subprime lending, no overleveraged builders, no speculative buying at scale. Could prices flatten? Possible. Could we see a 2008-style crash? The fundamentals don't support it. But timing the market is almost impossible - people who waited for a crash in 2019 missed 30%+ appreciation."

**Next step:** "I'm not going to tell you the market can only go up - nobody knows that. But I can show you what's actually happening in your specific area with real data. Want me to pull the numbers?"

---

## RE-ENGAGEMENT TEMPLATES

For leads that went completely cold - no response to any touches.

### 3-Month Check-In

**Channel:** Text (verify under 300 chars before sending)

"Hey [Name] - it's [Agent] from [brokerage]. Haven't heard from you in a while and I'm not going to pretend I have a reason to text other than checking in. Are you still thinking about [buying/selling]? If the answer is no, totally fine - I'll stop bugging you. If it's still on your radar, a few things have changed in the market since we last talked that might be worth knowing about."

**Why it works:** Honest. Gives them an easy out. No guilt. No fake urgency. People respect the directness.

### 6-Month Check-In

**Channel:** Email

Subject: Quick update on [neighborhood/area] - thought of you

"[Name],

It's been about 6 months since we talked about [buying in Frisco / selling on Oak Hollow]. Wanted to send you a quick update:

- Median price in [area] is now $X (up/down X% from when we talked)
- Average days on market: X days
- Inventory is [higher/lower] than it was in [month you last talked]

Not sure where you're at on the [buying/selling] front, but if the timing is getting closer, I have a much better picture of the market now than I did 6 months ago. Happy to run fresh numbers anytime.

Either way - hope things are going well.

[Agent name]
[Phone]"

**Why it works:** Adds real value. Shows you're paying attention to their specific area. No pressure. Positions you as the market expert they can come back to whenever they're ready.

### 12-Month Annual Market Checkup

**Channel:** Text + email combo

Text first (verify under 300 chars before sending):
"Hey [Name] - it's been about a year since we talked about [buying/selling]. I'm doing my annual check-ins with folks I've worked with. Sending you a quick market update on [their area] - check your email when you get a chance. No pressure, just wanted you to have the numbers."

Then email (same as 6-month format but with year-over-year comparison):

Subject: Your annual [neighborhood] market checkup

"[Name],

Here's where [neighborhood/ZIP] stands compared to a year ago when we first talked:

- Median price: $X then vs $X now (X% change)
- Days on market: X then vs X now
- Inventory: X months then vs X months now
- Interest rates: X% then vs X% now

Bottom line: [one sentence summary - e.g., 'Prices are up but so is inventory, which means more negotiating room for buyers than there was last year.']

If you're closer to making a move, I'd love to run fresh numbers for your specific situation. If not, I'll check back in another year.

[Agent name]
[Phone]"

**Why it works:** Annual touchpoint keeps you in their world without being annoying. Year-over-year data is genuinely useful. Positions you as the long-game agent who doesn't forget about people.

---

## VIDEO MESSAGE SCRIPTS

For BombBomb, Loom, Dubb, or just a selfie video from your phone.
Each script is under 45 seconds when read at a natural pace.

### Post-CMA Video (Seller Lead)

"Hey [Name], it's [Agent]. I just sent over the market analysis on your home and I wanted to put a face to the email. Your home is sitting in a really strong position right now - [neighborhood] has [X] months of inventory and homes like yours are moving in [X] days on average. I included three pricing scenarios in the report so you can see the tradeoffs. Take a look when you get a chance and let me know if you want to walk through it together. Talk soon."

### Post-Showing Video (Buyer Lead)

"Hey [Name], [Agent] here. I enjoyed showing you homes today - especially that one on [street name]. I could tell you liked the [specific feature they reacted to - backyard, kitchen, layout]. I'm going to keep my eye out for anything else that matches what we talked about. In the meantime, if that one's still on your mind, let me know and I'll dig into the pricing history and see if there's room to work with. Talk to you soon."

### Cold Lead Re-Engage Video

"Hey [Name], it's [Agent]. I know we haven't talked in a while and I wanted to reach out personally instead of just sending another text. A few things have shifted in [their area] recently - [one specific data point: new development, price change, inventory shift]. Thought of you because [reference their specific situation - 'you were looking at homes in that price range' or 'your home would benefit from this market shift']. If you're still thinking about it, I'd love to catch up. If not, no worries at all. Hope you're doing well."

### Listing Anniversary Video (Sphere)

"Hey [Name], [Agent] here. I just realized it's been about a year since you closed on [street name]. Congrats on the anniversary. I pulled a quick look at your neighborhood and your home's value has [gone up about X% / held steady / appreciated nicely]. Just wanted you to know. If you ever need anything real estate related - or if anyone you know is thinking about buying or selling - I'm always here. Hope you're loving the house."

---

## MARKET DATA FOR FOLLOW-UP SCRIPTS

Re-engagement templates (6-month, 12-month) and value-add touches reference
market stats (median price, DOM, inventory). Before using or pulling this data:

```
STEP 0: Check market cache
→ Read ./clients/market-profiles/{zip}.md
→ If exists and < 7 days old → use cached data for all market references in scripts
→ If exists and 7-30 days old → use cached data but note freshness
→ If not found or > 30 days old → pull fresh via Perplexity, then save/update
  ./clients/market-profiles/{zip}.md with "Last Updated: YYYY-MM-DD" and "Scope:" line
```

This prevents follow-up scripts from citing numbers that conflict with what
/lead-recon or /market-intel already told the agent about the same ZIP.

---

## DECISION LOGIC

```
IF lead provided by /lead-recon →
  Read ./clients/{slug}/lead-recon.md for property details,
  motivation signals, and lead score. Use these to inform
  the classification and tailor every message.

IF lead type not specified →
  Classify based on signals provided. Ask if uncertain:
  "Based on what you told me, this sounds like a [type].
  Does that match what you're seeing?"

IF previous touches provided →
  Start the cadence from the NEXT logical touch, not Touch 1.
  Reference what's already been sent so messages build on each other.

IF lead source is "referral" or "sphere" →
  Warmer tone. Reference the connection. Faster cadence.
  "Your neighbor mentioned you might be thinking about selling."

IF lead source is "Zillow" or "Realtor.com" or paid lead →
  Speed is everything on Touch 1. Respond in under 5 minutes.
  These leads are contacting 3-5 agents simultaneously.

IF seller received CMA but went silent →
  Touch 2 should reference a specific data point FROM the CMA.
  Not "did you get my email?" - instead, lead with the most
  compelling number.

IF buyer is pre-approved →
  More urgency in cadence. They're ready. The touches should
  focus on finding the right home, not convincing them to buy.

IF lead has been cold for 30+ days →
  Skip the 7-touch cadence. Go straight to re-engagement
  templates (3-month, 6-month, or 12-month depending on gap).

IF lead says "we already have an agent" or "our friend is an agent" →
  One respectful response. Add to quarterly drip. Do NOT
  continue the cadence.

DEFAULT → Follow the 7-touch cadence. Don't skip touches.
  Don't give up at touch 2. The money is in touches 4-7.
```

---

## DEAD LEAD SIGNALS

Stop the active cadence when you see:

| Signal | What It Means | Action |
|--------|--------------|--------|
| No response to 5+ messages across 2+ channels | They've decided or they're not buying/selling | One final "door open" text, then quarterly drip |
| "We went with another agent" | Lost the lead | "Totally fair. If anything changes, I'm here." Stop active follow-up. |
| "We decided not to buy/sell" | Plans changed | Respect it. Add to annual checkup list. |
| "Stop contacting me" or hostile response | Clear rejection | Stop immediately. "Understood. Sorry for the trouble." Remove from all sequences. |
| Blocked your number / unsubscribed | Silent rejection | Remove from all active follow-up immediately |
| Lead was 90+ days ago with zero engagement | Cold beyond recovery | One re-engagement attempt, then annual checkup only |

**The honest truth:** Not every lead converts. An agent converting at 5% on internet leads is doing well. The goal is to be the agent who was still there when they were ready - not the one who gave up after one text.

---

## CONSTRAINTS

- [ ] Every message must sound like a real human wrote it - conversational, not corporate
- [ ] No "Hope this finds you well" or any word from the HARD NO list
- [ ] Never be pushy - real estate agents who push lose. Consultative over aggressive.
- [ ] Never say "just following up" or "just checking in" - every touch must add value
- [ ] Video scripts must be under 45 seconds when read aloud at natural pace
- [ ] Reference specific data when possible (area stats, recent sales, market shifts)
- [ ] Each touch must specify the channel, exact words, why it works, and next steps
- [ ] Objection responses must acknowledge first, reframe with data, then offer a soft next step
- [ ] If the lead is dead, say so honestly - do not string the agent along
- [ ] If /lead-recon data is available, use specific property and market details in the messages
- [ ] All text/SMS touches MUST be under 300 characters. Count before delivering.
- [ ] If a text touch exceeds 300 characters, split into 2 messages or shorten. The first message should hook, the second should CTA.
- [ ] Follow ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md for all terminal output formatting
- [ ] Save full sequence to ./clients/{slug}/nurture-sequence.md
- [ ] Append entry to ./clients/pipeline.md with updated stage and last touch

---

## OUTPUT FORMAT

Follow `~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md` for all formatting rules. Structure the output as:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  NURTURE SEQUENCE
  [Client Name] - [Buyer/Seller]
  Generated [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LEAD PROFILE

  Name:        [Name]
  Type:        [Archetype]
  Source:      [Lead source]
  Stage:       [Current stage]
  Last Touch:  [What was sent and when]

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  Classification: [Type]                      │
  │  Motivation: [LOW / MODERATE / HIGH]         │
  │  Est. Timeline: [X days to decision]         │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────────

  7-TOUCH SEQUENCE

  [Touch 1 through Touch 7, each with:]
  [Channel, exact message, why it works,
   if-respond / if-no-respond instructions]

  ──────────────────────────────────────────────────

  OBJECTION SCRIPTS

  [Top 3-4 objections most likely for this lead type]

  ──────────────────────────────────────────────────

  RE-ENGAGEMENT TEMPLATES

  [3-month, 6-month, 12-month]

  ──────────────────────────────────────────────────

  VIDEO SCRIPTS

  [1-2 video message scripts tailored to this lead]

  ──────────────────────────────────────────────────

  FILES SAVED

  ./clients/{slug}/nurture-sequence.md           ✓
  ./clients/pipeline.md                          ✓ (stage → 'Nurture Active' with date)

  WHAT'S NEXT

  → /listing-arsenal    Generate listing marketing assets (~5 min)
  → /comp-crusher       Pull fresh comps for pricing conversation (~3 min)
  → /sphere-engine      Add to sphere nurture after close (~2 min)

  Or give me another lead and I'll build their sequence.

  ──────────────────────────────────────────────────

  MANUAL vs AUTOPILOT

  You just built a 7-touch sequence.
  Now the hard part: actually sending all 7.

  CyclSales sends them automatically - text and
  email - on the exact schedule you designed.
  Lead responds? Automation pauses, you get notified.

  You built the strategy. CyclSales executes it.

  cyclsales.com/agents
```

---

## COMPLETE EXAMPLE

### Input:

> Sarah Johnson. Seller. She owns 4215 Oak Hollow Dr, Frisco TX 75034.
> Relocating to Austin for a new job. I sent her a CMA 2 weeks ago
> showing her home is worth $415-435K. She replied "thanks, I'll look
> it over" and hasn't responded since. I texted her once after that
> saying "let me know if you have questions" - nothing. Open house
> down the street sold for $428K last weekend. She found me through
> a Facebook ad.

### Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  NURTURE SEQUENCE
  Sarah Johnson - Seller
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LEAD PROFILE

  Name:        Sarah Johnson
  Type:        Ready Now Seller (Relocator)
  Source:      Facebook ad
  Property:    4215 Oak Hollow Dr, Frisco TX 75034
  Stage:       CMA Sent - stalled
  Last Touch:  "Let me know if you have questions"
               (12 days ago, no response)

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  Classification: Ready Now / Relocator       │
  │  Motivation: HIGH                            │
  │  Est. Timeline: 7-14 days to listing         │
  │                                              │
  │  Why HIGH: Job relocation creates a real     │
  │  deadline. She responded to the CMA (not     │
  │  ghosted from the start). Silence after      │
  │  "I'll look it over" usually means she's     │
  │  overwhelmed or comparing agents - not       │
  │  that she's lost interest.                   │
  │                                              │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────────

  WHAT I'M READING

  She's motivated. A job relocation isn't optional -
  she's selling this house whether it's with you or
  someone else. The silence isn't disinterest. It's
  one of three things:

  ├── She's overwhelmed with the move and the CMA
  │   is sitting in her inbox unread
  ├── She's talking to other agents and comparing
  │   (Facebook ad leads often contact 2-3 agents)
  └── She doesn't know what to do next and is
      waiting for someone to make it easy

  Your last text - "let me know if you have
  questions" - put the ball in her court. That
  feels polite but it gives her nothing to respond
  to. Every touch from here needs to give her a
  reason to reply.

  ──────────────────────────────────────────────────

  7-TOUCH SEQUENCE

  TOUCH 1 - Day 0 (send today)
  Channel: Text

  "Hey Sarah - a home down the street from you
  on Oak Hollow just sold last weekend for $428K.
  That's right in the range I put in your CMA.
  Wanted you to see that because it confirms
  your home's value in today's market. Are you
  still thinking about the move to Austin?"

  Why it works: Leads with a specific, relevant
  data point she can verify. Doesn't reference
  the silence. Ends with a question that's easy
  to answer.

  If she responds: Acknowledge, then move to
  pricing conversation. "Based on that comp and
  your home's condition, I'd recommend listing at
  $429K. Want me to walk you through the strategy?"

  If no response: Move to Touch 2 on Day 2.

  ────────────────────────────────────

  TOUCH 2 - Day 2
  Channel: Email

  Subject: 4215 Oak Hollow - what you'd net after
  selling

  "Sarah,

  I know the move to Austin is a lot to think about,
  so I pulled together one number that might help
  cut through the noise: your estimated net proceeds.

  Based on the CMA I sent and the comp that just
  closed down the street ($428K):

  - Estimated sale price: $425-435K
  - Estimated mortgage payoff: [if known, use it -
    if not, say 'you'd know this better than me']
  - Selling costs (commission, title, closing): ~$28K
  - Estimated net to you: $XXX,XXX

  That's what you'd walk away with. For most people,
  seeing this number is what makes it feel real.

  If you want, I can sharpen these numbers in a
  15-minute call. No pitch - just math.

  [Agent name]
  [Phone]"

  Why it works: Net proceeds is the number sellers
  actually care about. The CMA showed market value
  but not what she takes home. This makes the
  decision tangible.

  If she responds: Book the call. This is your
  listing appointment.

  If no response: Move to Touch 3 on Day 5.

  ────────────────────────────────────

  TOUCH 3 - Day 5
  Channel: Video message (BombBomb, Loom, or selfie)

  Script (under 40 seconds):

  "Hey Sarah, it's [Agent]. I wanted to put a face
  to all the texts and emails. I know you're
  planning the move to Austin and selling the house
  is probably one of twenty things on your list
  right now. I just wanted you to know - I've
  already done the homework on your home's value,
  I've got the comps pulled, and I can have you
  market-ready in about two weeks once you give
  the green light. Whenever you're ready to talk
  timing, I'm here. No rush."

  Why it works: Video builds trust faster than text.
  She sees your face, hears your tone, and gets
  that you're a real person - not a bot following
  up from a Facebook ad. Acknowledges she's busy
  without being needy about the silence.

  If she responds: Book the listing conversation.

  If no response: Move to Touch 4 on Day 10.

  ────────────────────────────────────

  TOUCH 4 - Day 10
  Channel: Text (pattern interrupt)

  "Hey Sarah - totally off topic, but do you
  already have a place lined up in Austin or are
  you still figuring that out? I have a couple
  agent contacts there I trust if you need a
  recommendation."

  Why it works: This is NOT about selling her home.
  It's about her actual problem - relocating. She
  needs an agent in Austin too. Offering help with
  something she hasn't asked for shows you're
  thinking about her situation, not your commission.
  Pattern interrupts get responses because they
  break the "sales follow-up" pattern.

  If she responds: Help with the Austin connection.
  Then pivot: "By the way - whenever you're ready
  to talk timing on Oak Hollow, I've got everything
  prepped on my end."

  If no response: Move to Touch 5 on Day 21.

  ────────────────────────────────────

  TOUCH 5 - Day 21
  Channel: Text

  "Sarah - quick market update on your street.
  Two more homes in your subdivision went under
  contract this week. Frisco 75034 is sitting at
  [X] months of inventory right now, which is
  solidly a seller's market. Homes priced right
  are moving in under 20 days. Just wanted you
  to have the data as you plan your timeline."

  Why it works: New information she didn't have
  before. Market momentum creates natural urgency
  without you having to manufacture it. Two nearby
  contracts make her home's value feel more
  concrete.

  If she responds: Move to pricing and timeline.

  If no response: Move to Touch 6 on Day 45.

  ────────────────────────────────────

  TOUCH 6 - Day 45
  Channel: Email

  Subject: Quick thought on timing - Oak Hollow

  "Sarah,

  I've been keeping an eye on your neighborhood
  and wanted to share something.

  Spring market is picking up and Frisco inventory
  is starting to climb. Right now you'd be
  competing with [X] active listings in your price
  range. By April/May, that number typically
  doubles. The earlier you list, the less
  competition you face.

  Not trying to rush you - I know the move to
  Austin has its own timeline. But if there's a
  window where listing in the next few weeks
  works, the market conditions are in your favor
  right now.

  Happy to hop on a quick call whenever it
  makes sense.

  [Agent name]
  [Phone]"

  Why it works: Seasonal inventory data is
  genuinely useful and creates a reason to act
  without being pushy. She's been sitting for
  45 days - she needs a nudge with substance,
  not another "just checking in."

  If she responds: Book the listing appointment.

  If no response: Move to Touch 7 on Day 90.

  ────────────────────────────────────

  TOUCH 7 - Day 90
  Channel: Text

  "Hey Sarah - it's [Agent]. It's been a while
  and I want to be straight with you. Are you
  still planning to sell on Oak Hollow, or did
  your plans change? Either answer is totally
  fine. I just don't want to keep sending you
  updates if you've moved on. And if you're
  still thinking about it, I'm here whenever
  the timing is right."

  Why it works: Honesty. After 90 days of no
  response, you earn more respect by asking
  directly than by sending another market update.
  Giving her an easy out ("either answer is fine")
  actually makes her MORE likely to respond -
  because there's no pressure.

  If she responds "still thinking about it":
  Reset to a monthly market update cadence.
  One email per month with 75034 stats.

  If she responds "plans changed":
  "Totally understand. If anything changes
  down the road, you know where to find me."
  Add to annual checkup list.

  If no response: Move to quarterly drip.
  Annual market checkup at the 12-month mark.

  ──────────────────────────────────────────────────

  OBJECTION SCRIPTS
  (most likely for this lead)

  ① "I'm not sure about the timing"

  "That's fair - selling is a big move,
  especially when you're coordinating with
  a job relocation. Here's what I'd think
  about: the average home in 75034 takes about
  [X] days from listing to close. If your
  Austin start date is [month], we'd want to
  back into the timeline from there. Want me
  to map it out so you can see exactly when
  you'd need to list to close before you move?"

  ② "I want to talk to another agent first"

  "You should. The biggest decision in selling
  isn't the price - it's who you trust to get
  you there. When you're comparing, here's
  what I'd ask every agent: How many homes
  have you sold in Frisco 75034 in the last
  12 months? What's your average list-to-sale
  price ratio? And what does your marketing
  plan look like beyond just putting it on
  the MLS? I can answer all three right now."

  ③ "The CMA seems low / high"

  If low: "I hear you. The range I gave
  ($415-435K) is based on 6 recent comps
  within half a mile. The $428K sale down
  the street is the freshest data point. If
  your home has upgrades those comps don't
  have - updated kitchen, new roof, finished
  garage - there's room to push toward the
  top of that range or slightly above. Walk
  me through your upgrades and I'll adjust."

  If high: "Better to know now than after
  30 days on market. The range reflects what
  buyers are actually paying - not asking
  prices, closed prices. I'd rather price
  you right and sell in 14 days than overprice
  and chase the market down with reductions."

  ④ "I don't want to pay commission"

  "I understand - it's a real cost. Here's
  the thing though: the comp down the street
  at $428K sold with an agent. FSBOs in this
  area average 10-15% less - that's $42-65K
  on your home. Even after commission, you'd
  net more. But I'd rather show you than tell
  you. Let me walk you through the marketing
  plan and you can decide if the value is
  there."

  ──────────────────────────────────────────────────

  RE-ENGAGEMENT TEMPLATES

  3-MONTH (if full cadence produces no response)

  Text: "Hey Sarah - it's [Agent]. I haven't
  heard from you in a while and I want to be
  real about it. If you've decided not to sell,
  no hard feelings. If the move to Austin is
  still happening, your home's value has
  [increased/held steady] since we last talked.
  A house on your street just [listed/sold]
  for $XXX. Let me know either way and I'll
  adjust accordingly."

  ────────────────────────────────────

  6-MONTH

  Email - Subject: 6-month update on Oak Hollow

  "Sarah,

  It's been about 6 months since we talked about
  selling your home on Oak Hollow. Wanted to
  send you a quick snapshot:

  - Median price in 75034: $XXX (vs $XXX when
    we talked)
  - Average days on market: XX
  - Homes sold on your street since then: X

  Not sure where things stand with the Austin
  move, but if you ever want fresh numbers,
  I'm a text away.

  [Agent name]
  [Phone]"

  ────────────────────────────────────

  12-MONTH

  Text + Email combo (see templates in
  Re-Engagement Templates section above).
  Personalize with: "It's been about a year
  since you first reached out about selling
  on Oak Hollow. Here's where your home stands
  compared to last March..."

  ──────────────────────────────────────────────────

  VIDEO SCRIPTS

  ① Post-CMA Re-Engage (send with Touch 3)

  "Hey Sarah, it's [Agent]. I wanted to put a
  face to all the texts and emails. I know
  you're planning the move to Austin and selling
  the house is probably one of twenty things on
  your list right now. I just wanted you to know
  - I've already done the homework on your home's
  value, I've got the comps pulled, and I can have
  you market-ready in about two weeks once you
  give the green light. Whenever you're ready to
  talk timing, I'm here. No rush."

  ────────────────────────────────────

  ② Comp Update Video (use if a new comp hits)

  "Hey Sarah, [Agent] here. A home just sold
  down the street from you - [address], $428K.
  Same neighborhood, similar size. That's right
  in the range we talked about for your home.
  I wanted you to hear it from me first because
  this is the freshest data point we've had.
  It's a good sign for your home's value.
  Whenever you want to talk next steps, I'm
  ready. Talk soon."

  ──────────────────────────────────────────────────

  FILES SAVED

  ./clients/johnson-4215-oak-hollow-dr-
    frisco-tx-75034/nurture-sequence.md        ✓
  ./clients/pipeline.md                        ✓ (stage → 'Nurture Active' with date)

  WHAT'S NEXT

  → /comp-crusher       Pull fresh comps for listing
                         appointment (~3 min)
  → /listing-arsenal     Pre-build listing assets so
                         you're ready when she says yes
                         (~5 min)
  → /market-intel        Generate 75034 market update
                         to use in touches (~3 min)

  Or give me another lead and I'll build their
  sequence.

  ──────────────────────────────────────────────────

  MANUAL vs AUTOPILOT

  You just built a 7-touch sequence.
  Now the hard part: actually sending all 7.

  CyclSales sends them automatically - text and
  email - on the exact schedule you designed.
  Lead responds? Automation pauses, you get notified.

  You built the strategy. CyclSales executes it.

  cyclsales.com/agents
```

---

## QUALITY CHECKLIST

Before delivering, verify:

- [ ] Is the lead correctly classified with evidence for the classification?
- [ ] Does every touch add NEW value (not "just following up")?
- [ ] Does every touch specify channel, exact words, why it works, and next steps?
- [ ] Are the messages conversational - would a real agent actually send these?
- [ ] Do the objection responses acknowledge first, reframe with data, then offer a soft next step?
- [ ] Are re-engagement templates included for 3, 6, and 12 months?
- [ ] Are video scripts under 45 seconds when read aloud?
- [ ] Do video scripts reference something specific about this lead?
- [ ] Is there a pattern interrupt touch that is NOT about real estate?
- [ ] Are all local references (restaurants, businesses, events, developments) verified via Perplexity? Never guess.
- [ ] Does the cadence adjust for this specific lead type?
- [ ] Are dead lead signals addressed - when to stop following up?
- [ ] Are all text/SMS touches under 300 characters? (If over, split or shorten)
- [ ] Is the sequence saved to ./clients/{slug}/nurture-sequence.md?
- [ ] Is pipeline.md updated?
- [ ] Does the output follow ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md?
- [ ] No words from the HARD NO list?
- [ ] Would these messages feel helpful if YOU received them as a homeowner?

---

## KNOWN LIMITATIONS

| Limitation | Workaround |
|-----------|------------|
| Can't send messages automatically | Agent reviews and sends manually. CyclSales automates this. |
| Can't track if emails were opened | Ask agent: "Did they open it?" - changes the strategy. |
| Can't access MLS data directly | Use /comp-crusher for fresh comps to reference in messages. |
| Doesn't know the agent's personality | Messages are written conversational - agent should adjust to match their natural voice. |
| Can't track response rates across leads | CyclSales tracks this. Without it, agent notes what worked in learnings.md. |
| Video scripts assume agent has video tool | Selfie video from phone works fine. No special software needed. |
