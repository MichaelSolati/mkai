---
name: match-tracker
description: "Manage dating-app matches end-to-end: create per-match dossiers and conversation logs in your Obsidian vault, log incoming exchanges, craft replies via message-crafter, schedule dates with conflict awareness, capture personal likes/dislikes/anecdotes, and keep profiles up to date - all through natural conversation. Use when someone says 'new match', 'log her reply', 'what should I say to', 'matched with', 'she said', 'update profile', 'active matches', 'schedule a date', 'am I free Saturday', 'I love X', 'I always tell this story', or wants help with an ongoing dating conversation."
argument-hint: "Who is the match and what do you need? (new match, log exchange, craft reply, update profile, schedule date, check calendar, capture like/dislike/story, list active)"
---

# Match Tracker

## What This Skill Does

Single entry point for everything related to a specific match or your dating life in general. You talk naturally — "new match Sarah on Hinge", "Nina just replied, what do I say?", "schedule drinks with Sarah next Saturday", "am I free the 28th?", "save this story about Chicago" — and the skill handles all vault plumbing automatically.

It delegates:
- **Vault management** → `match_tracker.py` helper (wraps obsidian.py — never call obsidian.py directly)
- **Message crafting** → `message-crafter` skill (via Skill tool)
- **Voice grounding** → `my-voice` skill (via `writing` profile) + vault voice samples

---

## Helper Command Path

All vault operations go through the helper:

```bash
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py <command> [args]
```

Every command returns JSON: `{"ok": true|false, "command": "...", "data": {...}, "warnings": [...], "errors": [...]}`. Parse `data` directly — never parse obsidian.py output yourself.

See `references/workflows.md` for exact call sequences per operation.

---

## Trigger Recognition

Route to the correct operation based on what the user says:

| Signal | Operation |
|--------|-----------|
| "new match", "matched with [Name] on [App]", "I matched with" | **New match** |
| "she replied", "she said", "[Name] said", "log this exchange", "log her reply", "she sent" | **Log exchange** |
| "what should I say to [Name]", "help me reply to [Name]", "draft a message for [Name]", "how should I respond to [Name]", "opener for [Name]" | **Craft reply** |
| "update [Name]'s profile", "[Name] told me she", "add to [Name]'s notes", "[Name] mentioned" | **Update profile** |
| "active matches", "who am I talking to", "list my matches", "dating status" | **List active** |
| "update my voice samples", "update my texting samples", "re-calibrate my voice" | **Voice refresh** |
| "update my profile", "save this about me", "add to my dossier", "remember that I", "I work as", "I live in" | **Update my profile** |
| "what do you know about me", "show my profile", "read my dossier" | **View my profile** |
| "schedule a date with [Name]", "I'm seeing [Name] on [date]", "set up a date for", "[Name] and I are getting drinks/coffee/dinner" | **Schedule date** |
| "upcoming dates", "what's on my calendar", "any dates this week/weekend", "who am I seeing" | **List events** |
| "am I free [date]", "do I have anything that day", "can I see [Name] on the [date]" | **Check conflict** |
| "the date with [Name] is moved/cancelled", "we rescheduled", "she cancelled" | **Update / cancel event** |
| "the date went well/badly", "log how the date went", "we went out last night" | **Complete event** |
| "I love X", "I really like X", "I'm into X" | **Capture like** (after confirmation) |
| "I can't stand X", "I hate X", "X drives me up the wall", "X is a turnoff" | **Capture dislike** (after confirmation) |
| "I always prefer X", "I'd rather X than Y", soft pattern | **Capture preference** (after confirmation) |
| "I always tell the story about", "remember that time I", "save this anecdote", "I want to remember this story" | **Capture anecdote** (after confirmation) |
| "what stories haven't I told [Name]", "what are my anecdotes", "which stories can I use" | **List anecdotes** |

When the person's name is ambiguous, ask. When the operation is ambiguous, ask. Keep clarifying questions to one at a time.

---

## Name Collisions

Matches are stored at `dating/<name-slug>/`. When a name collides, follow these rules.

### At new-match intake

Before writing any files, call `list-matches` and check whether a slug matching the normalized `<First>` already exists.

1. **No existing slug** → proceed normally. `dating/sarah/`
2. **Exact slug match** → ask user for both Sarahs' last initials:
   - Both known: `disambiguate sarah --to sarah-k` then create `dating/sarah-m/`.
   - One or both unknown: use platform suffix → `dating/sarah-bumble/` vs `dating/sarah-hinge/`.
   - Platform also collides: use ordinal by match date → `dating/sarah-1/` (earlier), `dating/sarah-2/` (later).
3. **Always confirm before renaming.** Never rename silently.
4. Record disambiguator type in both profiles' Quick Facts (`Display name:` and `Disambiguator type:` fields).

`disambiguate` also rewrites the `match:` field and `with:` wikilink in every calendar event for that match.

### At lookup

1. Call `match-summary <slug>` — it handles not-found gracefully.
2. Or call `list-matches` and filter by name prefix.
3. When multiple candidates: surface each with platform and last-exchange date, then ask.
4. Zero matches: offer to start new-match flow.

---

## Operations

See `references/workflows.md` for step-by-step helper call sequences.

### 1. New match

1. Ask: name, app (Hinge/Bumble/Tinder), "what caught your eye about her?"
2. Ask user to paste her full profile.
3. `match_tracker new-match --name ... --platform ... --matched ... --profile-file $TMPDIR/profile.md`
4. Ask: "Want me to craft an opener now?"

### 2. Log exchange

1. `match_tracker match-summary <slug>` — get current state + last exchange number.
2. Ask: what did she send, what date, was it a response to something specific?
3. `match_tracker log-exchange <slug> --her-file $TMPDIR/exchange.md --read YYYY-MM-DD`
4. Scan for profile-worthy signals. If found: prompt to update.
5. Ask: "Want me to help draft a reply?"

### 3. Craft reply

1. Check calendar: `match_tracker list-events --upcoming --from today --to +14d` — note any dates already booked before suggesting times.
2. `match_tracker assemble-context <slug> --stage <stage> --purpose "..."` → get the full context block.
3. Invoke `message-crafter` via Skill tool with `args` set to `data.context_block`.
4. Present options verbatim.
5. **Stop and wait.** Do NOT log anything yet.
6. When user says "I sent [X]": `match_tracker log-reply <slug> --my-file $TMPDIR/reply.md --sent YYYY-MM-DD`
7. If a story/anecdote was included: `match_tracker mark-anecdote-used <id> --with <slug>`

### 4. Update profile

1. `match_tracker update-match <slug> --section "Notes & Observations" --file $TMPDIR/note.md --operation append`
2. Or for facts that changed: `--operation replace` on the relevant section.
3. Confirm what was added.

### 5. Update my profile

1. Identify the section from what the user shared (see section routing in `references/workflows.md`).
2. `match_tracker update-my-profile --section "<Section>" --file $TMPDIR/note.md --operation append`
3. For updating stale facts: `--operation replace`.

### 6. View my profile

1. `match_tracker view-my-profile` — display full contents.
2. Offer: "Anything you want to add, update, or remove?"

### 7. List active

1. `match_tracker list-matches [--status active]` → table of Name / App / Matched / Status / Last Exchange / Next Date.

### 8. Voice refresh

1. Ask: "Paste 5–10 recent texts you've sent."
2. Write to `$TMPDIR/voice-samples.md`, then: `match_tracker voice-refresh --samples-file $TMPDIR/voice-samples.md`

### 9. Schedule date

1. `match_tracker check-conflict --date YYYY-MM-DD [--start HH:MM]` — check first.
2. If conflicts: surface them and ask user to confirm or pick a different time.
3. `match_tracker schedule <slug> --date YYYY-MM-DD [--start HH:MM] [--where "..."] [--activity drinks] [--force]`
4. `data.event_id` is the canonical reference for future updates.

### 10. List events

1. `match_tracker list-events --upcoming` — all upcoming non-cancelled events.
2. Or `--from YYYY-MM-DD --to YYYY-MM-DD` for a date range.
3. Surface as: **Name | Date | Time | Where | Activity | Status**.

### 11. Check conflict

1. `match_tracker check-conflict --date YYYY-MM-DD [--start HH:MM] [--buffer-minutes 30]`
2. Return `data.has_conflict` and `data.same_day` list.

### 12. Update / cancel event

- **Reschedule:** `match_tracker update-event <event_id> --date YYYY-MM-DD --start HH:MM --status rescheduled`
- **Cancel:** `match_tracker cancel-event <event_id> [--reason "..."]`

### 13. Complete event

1. Ask: how did it go? Write outcome and reflection to temp files.
2. `match_tracker complete-event <event_id> --outcome-file $TMPDIR/outcome.md [--reflection-file $TMPDIR/reflection.md]`
3. Offer: "Want to update her profile with anything you learned?"

---

## Auto-Capture Suggestions

During any conversation flow, stay alert for signals the user reveals about themselves. Types and where they route:

| Signal | Capture type | Target |
|--------|-------------|--------|
| "I love X", "I really like X", "I'm into X" | `like` | `## Likes` in my-profile |
| "X drives me up the wall", "I can't stand X" | `dislike` | `## Dislikes` in my-profile |
| "I always prefer X", "I'd rather X than Y" | `preference` | `## Preferences` in my-profile |
| Hard no, non-negotiable | `dealbreaker` | `## Dealbreakers & Friction` |
| Go-to spot, date idea | `date-idea` | `## Date Repertoire` |
| Recurring phrase, humor pattern | `voice-anchor` | `## Voice Anchors` |
| Concrete fact (job, neighborhood, age) | `fact` | `## Quick Facts` |
| Story worth retelling | `anecdote` | `dating/_meta/anecdotes.md` |
| Everything else | `note` | `## Notes` |

**Flow:** detect signal → identify type from table → preview to user: "Want me to save that to your dossier? It would go under `## Likes`" → save on confirmation only. Never auto-write.

**Schedule-suggestion guard:** In the Craft reply flow (Step 1), always check `list-events --upcoming` before suggesting a date. Never propose a time you know is already booked.

---

## Multi-Step Conversations

After completing any operation, stay in context — don't exit. The user may:
- Reply to drafted messages → loop into **log exchange** → **craft reply**
- Add profile info mid-conversation → run **update profile** inline, then continue
- Ask about a different match → confirm name switch, reload context

---

## Notes

**Never fabricate context.** If files don't exist for a name, say so and offer new-match flow.

**Same-name collisions are eager-resolved.** Both folders get a disambiguator. Confirm before renaming.

**No auto-logging.** Only append sent messages after explicit user confirmation ("I sent it", "I went with B").

**Templates are strict.** Use the structures in `references/profile-template.md`, `references/conversation-template.md`, and `references/my-profile-template.md` exactly.

**TMPDIR for writes.** All multi-line content must be written to `$TMPDIR/<name>.md` first and passed via `--file` to the helper. Never inline multi-line content as a positional argument.

---

## Related Skills

- `message-crafter` — invoked by this skill's **craft reply** flow.
- `hinge-profile-optimizer` — for optimizing YOUR Hinge profile. Reads and writes the same `dating/_meta/my-profile.md` dossier.
- `obsidian` — vault primitives. Used internally by `match_tracker.py`; don't call directly.
- `my-voice` — loaded via the `writing` profile. Provides prose voice baseline as ambient context.
