# Voice Handoff Reference

How match-tracker assembles voice context and passes it to message-crafter.

---

## Use `assemble-context` — don't build the context block manually

```bash
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py assemble-context <slug> \
  --stage <stage> \
  --purpose "<what the user wants>"
```

Returns `{context_block, slug, stage, includes_my_profile, includes_voice_samples, anecdote_count}`.

Pass `data.context_block` verbatim as `args` to the `message-crafter` Skill. Done.

The helper pulls everything automatically: match profile, conversation log, user dossier (all sections including Likes/Dislikes/Preferences), voice samples, and the anecdotes not yet used with this match. You never need to read individual files and concatenate them.

---

## What `assemble-context` includes

| Block | Source | Required? |
|-------|--------|-----------|
| `[CONTEXT]` | stage + purpose args | Yes |
| `[ABOUT ME]` | `dating/_meta/my-profile.md` | Optional — placeholder if absent |
| `[ANECDOTES]` | `dating/_meta/anecdotes.md` (unused with this match) | Optional — omitted if no anecdotes |
| `[HER PROFILE]` | `dating/<slug>/profile.md` | Yes |
| `[CONVERSATION LOG]` | `dating/<slug>/conversation.md` | Yes |
| `[VOICE: texting samples]` | `dating/_meta/voice-samples.md` | Required — warning if absent |

**Order matters:** `[ABOUT ME]` before `[HER PROFILE]` primes personalization from who the user is, not who she is.

**Anecdotes block:** surfaces up to 5 unused anecdotes with their tags and 1-line summaries. message-crafter can reference them when they fit naturally. After a message is sent with an anecdote, call `mark-anecdote-used <id> --with <slug>`.

---

## Voice sources

### 1. Dating-specific texting samples (required)

**Vault path:** `dating/_meta/voice-samples.md`
**Created by:** match-tracker's **voice refresh** flow (`voice-refresh --samples-file ...`)
**What it contains:** 5–10 raw text messages the user has sent to anyone.
**Status:** Required. If absent, run voice refresh before crafting — `assemble-context` emits a warning.

### 2. My-voice skill (optional enrichment)

**Loaded via:** `writing` profile (declared in `requires`)
**What it provides:** Prose voice profile, vocabulary fingerprints, humor style, anti-slop rules.
**Status:** Ambient context already in the agent's skill context. Present if the `writing` profile is active.

### 3. User dossier (optional)

**Vault path:** `dating/_meta/my-profile.md`
**What it contains:** Identity, interests, lifestyle, what I'm looking for, dealbreakers, date repertoire, conversation style notes, **Likes, Dislikes, Preferences** (new sections).
**Status:** Optional — placeholder if absent. Grows over time via auto-capture.

---

## Context block format (for reference — use assemble-context, don't build this manually)

```
[CONTEXT]
Platform: {Hinge | Bumble | Tinder}
Conversation stage: {opener | early-game | mid-game | date-seed | recovery | logistics}
User wants: {describe specifically}
Voice calibration: pre-loaded - skip Phase 1 and proceed directly to situation assessment.

[ABOUT ME]
{full contents of dating/_meta/my-profile.md}
- OR -
Not available. User can build one via match-tracker's "update my profile" flow.

[ANECDOTES — unused with this match]
- a-2026-001: The band in Chicago [music, travel, embarrassing]
  Short summary...
- a-2026-003: The bike commute incident [work, embarrassing]
  Short summary...

[HER PROFILE]
{full contents of dating/<slug>/profile.md}

[CONVERSATION LOG]
{full contents of dating/<slug>/conversation.md}

[VOICE: texting samples]
{full contents of dating/_meta/voice-samples.md}
```

The `my-voice` skill is already in context — no `[VOICE: prose baseline]` block needed.

---

## After the message is sent

```bash
# 1. Log the sent reply
python3 ~/.mkai/.../match_tracker.py log-reply <slug> --my-file "$TMPDIR/reply.md" --sent YYYY-MM-DD

# 2. If an anecdote was used, mark it
python3 ~/.mkai/.../match_tracker.py mark-anecdote-used <anecdote-id> --with <slug> --date YYYY-MM-DD
```

---

## Updating voice samples

Refresh when:
- Messages feel "off" or "like a dating coach"
- The user's texting style has changed
- It's been more than a few months

Run **voice refresh** flow, or say "update my texting samples."
