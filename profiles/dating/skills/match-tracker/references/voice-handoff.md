# Voice Handoff Reference

How match-tracker assembles voice context and passes it to message-crafter.

---

## Voice Sources

### 1. Dating-specific texting samples (required)

**Vault path:** `dating/_meta/voice-samples.md`
**Created by:** match-tracker's **voice refresh** flow
**What it contains:** 5–10 raw text messages the user has sent to anyone, preserving their exact texting style across 8 dimensions: sentence length/structure, emoji habits, capitalization, punctuation, humor style, vocabulary, formality, distinctive patterns.
**Role:** Primary voice signal for message-crafter. Texting voice ≠ prose writing voice.
**Status:** Required. If absent, run **Voice refresh** before crafting.

### 2. My-voice skill (optional enrichment)

**Loaded via:** `writing` profile (declared in `requires`)
**What it provides:** Prose voice profile, vocabulary fingerprints, humor style, anti-slop rules — derived from longer-form writing samples.
**Role:** Ambient context already in the agent's skill context. Enriches message-crafter's understanding of the user's personality, humor register, and what sounds authentically like them. Supplements but does not replace the texting samples.
**Status:** Present if the `writing` profile is active. Proceed without it if not; texting samples alone are sufficient.

### 3. User dossier (optional)

**Vault path:** `dating/_meta/my-profile.md`
**Created by:** match-tracker's **Update my profile** flow; enriched by `hinge-profile-optimizer`
**What it contains:** Identity, interests, lifestyle, what I'm looking for, dealbreakers, date repertoire, conversation style notes.
**Role:** Tells message-crafter *what the user brings* — not just how they write, but who they are. Enables genuine personalization.
**Status:** Optional. Proceed without; note "say 'update my profile' to start one."

---

## Layering Logic

| Source | Informs |
|--------|---------|
| Texting samples | *Format* — sentence length, punctuation, emoji, register |
| My-voice skill | *Substance* — humor style, vocabulary range, personality |
| User dossier | *Content* — interests, what he wants, where he'd take her |

The `my-voice` skill context is already loaded in the agent — do not manually read its files and inject them into the handoff. It informs message-crafter passively as standing context.

---

## Handoff Format for message-crafter Args

```
[CONTEXT]
Platform: {Hinge | Bumble | Tinder}
Conversation stage: {opener | early-game | mid-game | date-seed | recovery | logistics}
User wants: {describe specifically}
Voice calibration: pre-loaded - skip Phase 1 and proceed directly to situation assessment.

[ABOUT ME]
{full contents of dating/_meta/my-profile.md}
- OR -
[ABOUT ME]
Not available. User can build one via match-tracker's "update my profile" flow.

[HER PROFILE]
{full contents of dating/<name-slug>/profile.md}

[CONVERSATION LOG]
{full contents of dating/<name-slug>/conversation.md}

[VOICE: texting samples]
{full contents of dating/_meta/voice-samples.md}
```

**Order matters:** `[ABOUT ME]` before `[HER PROFILE]` primes personalization from who the user is, not who she is.

The `my-voice` skill is already in context — no `[VOICE: prose baseline]` block needed in the args.

---

## Voice Calibration Phase Handoff Note

Include `Voice calibration: pre-loaded - skip Phase 1 and proceed directly to situation assessment.` in the `[CONTEXT]` block. This tells message-crafter the texting samples are already provided and Phase 1 is complete.

---

## Updating Voice Samples

Voice samples should be refreshed when:
- The user's texting style changes (new phone, new habits)
- Messages feel "off" or "like a dating coach"
- It's been more than a few months since last refresh

Run the **voice refresh** flow, or say "update my texting samples."

The prose baseline lives in the `my-voice` skill and is updated separately via `/voice-setup`.
