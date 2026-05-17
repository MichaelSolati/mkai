# Voice Handoff Reference

How match-tracker layers voice sources and user context, then passes them to message-crafter.

---

## The Sources

### 1. Global prose voice profile
**Path:** `skills/my-voice/references/voice-profile.md`
**Created by:** `/voice-setup` skill
**What it contains:** Rhythm, vocabulary fingerprint, anti-AI-slop patterns, structural preferences - derived from longer writing samples.
**Role in messaging:** Baseline identity signal. Tells message-crafter *who this person is* tonally - their sense of humor, how they think, what's authentic to them. Prevents generic dating-coach output.
**Status:** May not exist (gitignored, generated locally). Proceed without it; note to user.

### 2. Prose sample excerpts
**Path:** `skills/my-voice/references/sample-excerpts.md`
**Created by:** `/voice-setup` skill
**What it contains:** Real excerpts from the user's own writing - few-shot examples that anchor the prose voice at the sentence level.
**Role in messaging:** Lets message-crafter calibrate format and vocabulary against actual examples, not just an abstract profile. Stronger signal than the profile alone.
**Status:** May not exist. Proceed without it; note to user to run `/voice-setup`.

### 3. Anti-slop baselines
**Paths:** `skills/my-voice/references/anti-slop-phrases.md` + `skills/my-voice/references/anti-slop-structures.md`
**Created by:** `/voice-setup` skill (static baselines, may be present even without a full voice profile)
**What they contain:** Universal banned phrases and structural anti-patterns that make writing read as AI-generated.
**Role in messaging:** Hard guardrails for message-crafter - applied on top of everything else.
**Status:** May not exist. Proceed without; message-crafter's own defaults cover the baseline.

### 4. Dating-specific texting samples
**Path (vault-relative):** `Dating/_meta/voice-samples.md`
**Created by:** match-tracker's **voice refresh** flow
**What it contains:** 5–10 raw text messages sent by the user (to anyone), preserving their exact style: sentence length, emoji habits, capitalization, punctuation, humor register.
**Role in messaging:** Texting-specific calibration. message-crafter's voice calibration phase maps these 8 dimensions: sentence length/structure, emoji habits, capitalization, punctuation, humor style, vocabulary, formality, distinctive patterns.
**Status:** If absent → run voice refresh before crafting. This source is required.

### 5. User dossier
**Path (vault-relative):** `Dating/_meta/my-profile.md`
**Created by:** match-tracker's **Update my profile** flow; also enriched by `hinge-profile-optimizer`
**What it contains:** Identity, interests, lifestyle, what I'm looking for, dealbreakers, date repertoire, conversation style notes, and voice anchors.
**Role in messaging:** Tells message-crafter *what the user brings* - not just how they write, but who they are. Enables personalization that reflects the user (shared interests, genuine hooks, first-date ideas that fit their life) rather than generic value-exchange patterns.
**Status:** May not exist. Proceed without; note "say 'update my profile' to start one."

---

## Layering Logic

The sources are complementary - pass all available, labeled separately. Do NOT collapse into a summary.

| Source | Informs |
|--------|---------|
| Texting samples | *Format* - how he types (length, punctuation, emoji) |
| Prose voice profile | *Substance* - humor style, vocabulary range, tone |
| Prose excerpts | *Examples* - few-shot anchor for the above |
| Anti-slop baselines | *Guardrails* - what never sounds like him |
| User dossier | *Content* - what he brings, what he wants, where he'd take her |

---

## Handoff Format for message-crafter Args

Structure the `args` string passed to the Skill tool exactly like this:

```
[CONTEXT]
Platform: {Hinge | Bumble | Tinder}
Conversation stage: {opener | early-game | mid-game | date-seed | recovery | logistics}
User wants: {describe specifically - opener, reply to her message, date ask, recovery, etc.}
Voice calibration: pre-loaded - skip Phase 1 and proceed directly to situation assessment.

[ABOUT ME]
{full contents of Dating/_meta/my-profile.md}
- OR -
[ABOUT ME]
Not available. User can build one via match-tracker's "update my profile" flow.

[HER PROFILE]
{full contents of Dating/<Name>/profile.md}

[CONVERSATION LOG]
{full contents of Dating/<Name>/conversation.md}

[VOICE: texting samples]
{full contents of Dating/_meta/voice-samples.md}

[VOICE: prose baseline]
{full contents of skills/my-voice/references/voice-profile.md}
- OR -
[VOICE: prose baseline]
Not available. Run /voice-setup to generate a global voice profile.

[VOICE: prose excerpts]
{full contents of skills/my-voice/references/sample-excerpts.md}
- OR -
[VOICE: prose excerpts]
Not available.

[VOICE: anti-slop baseline]
{full contents of skills/my-voice/references/anti-slop-phrases.md}
---
{full contents of skills/my-voice/references/anti-slop-structures.md}
- OR -
[VOICE: anti-slop baseline]
Not available.
```

**Order matters:** `[ABOUT ME]` comes before `[HER PROFILE]` so message-crafter reads who the user is before who she is. This primes personalization from the user's actual identity rather than reverse-engineering it from the match.

---

## Voice Calibration Phase Handoff Note

Include `Voice calibration: pre-loaded - skip Phase 1 and proceed directly to situation assessment.` in the `[CONTEXT]` block (as shown above). This tells message-crafter the samples are already in the args and it should treat Phase 1 as complete.

---

## Updating Voice Samples

Voice samples should be refreshed when:
- The user's texting style changes (new phone, new habits)
- Current messages feel "off" or "like a dating coach"
- It's been more than a few months since last refresh

Run the **voice refresh** flow from match-tracker, or say "update my texting samples."

The prose baseline is updated separately via `/voice-setup` (a more involved process). Don't conflate the two.
